/**
 * POST /api/chat — the portfolio assistant.
 *
 * Request:  { messages: { role: 'user' | 'assistant'; content: string }[] }  (last one from the user)
 * Response: the answer as a plain-text stream, plus headers:
 *   x-chat-mode     "ai" (Gemini answered) or "fallback" (rule-based answer from the portfolio)
 *   x-chat-sources  URI-encoded JSON [{ title, href }] of the passages the answer is based on
 *
 * Configuration: GEMINI_API_KEY, GEMINI_MODEL, GEMINI_BACKUP_MODEL, GEMINI_EMBEDDING_MODEL — see src/env.ts. The key is
 * server-only and never reaches the browser; without it every answer uses the rule-based fallback.
 */
import { GoogleGenAI } from '@google/genai';
import { error, json } from '@sveltejs/kit';
import type { Config } from '@sveltejs/adapter-vercel';
import { GEMINI_API_KEY, GEMINI_BACKUP_MODEL, GEMINI_EMBEDDING_MODEL, GEMINI_MODEL } from '$app/env/private';
import { fallbackAnswer, streamAnswer, type ChatMessage, type Stream } from '#lib/server/chat/assistant.ts';
import { retrieve } from '#lib/server/chat/retrieve.ts';
import type { RequestHandler } from './$types';

export const prerender = false;
export const config: Config = { maxDuration: 30 };

const MAX_MESSAGES = 10;
const MAX_USER_CHARS = 600;
const MAX_ASSISTANT_CHARS = 2000;
/** Gemini gets this long to answer (the function itself may run 30 s). */
const ANSWER_TIMEOUT_MS = 25_000;

// Best-effort per-instance rate limit (instances are reused, so this catches bursts).
const WINDOW_MS = 10 * 60_000;
const MAX_REQUESTS = 20;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
	const now = Date.now();
	const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
	recent.push(now);
	hits.set(ip, recent);
	if (hits.size > 5000) for (const [key, times] of hits) if (now - times.at(-1)! > WINDOW_MS) hits.delete(key);
	return recent.length > MAX_REQUESTS;
}

function parse(body: unknown): ChatMessage[] | null {
	const raw = (body as { messages?: unknown })?.messages;
	if (!Array.isArray(raw) || raw.length === 0) return null;
	const messages: ChatMessage[] = [];
	for (const m of raw.slice(-MAX_MESSAGES)) {
		const role = (m as ChatMessage)?.role;
		const content = (m as ChatMessage)?.content;
		if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') return null;
		const text = content.trim();
		if (!text || (role === 'user' && text.length > MAX_USER_CHARS)) return null;
		// Earlier answers are context only; long ones are trimmed rather than rejected.
		messages.push({ role, content: role === 'assistant' ? text.slice(0, MAX_ASSISTANT_CHARS) : text });
	}
	while (messages[0]?.role === 'assistant') messages.shift(); // Gemini expects the user to speak first
	return messages.at(-1)?.role === 'user' ? messages : null;
}

const g = GEMINI_API_KEY
	? {
			// The SDK retries overload errors up to 5× with growing waits (seconds to minutes). One quick
			// retry is enough here: after that, streamAnswer moves on to the backup model.
			ai: new GoogleGenAI({
				apiKey: GEMINI_API_KEY,
				httpOptions: { retryOptions: { attempts: 2, initialDelay: 0.5, maxDelay: 1 } }
			}),
			models: [GEMINI_MODEL, GEMINI_BACKUP_MODEL],
			embeddingModel: GEMINI_EMBEDDING_MODEL
		}
	: null;

export const POST: RequestHandler = async ({ request, url, getClientAddress }) => {
	const origin = request.headers.get('origin');
	if (origin && origin !== url.origin) error(403, 'Cross-origin requests are not allowed');

	if (rateLimited(getClientAddress())) {
		return json(
			{ message: "You've sent a lot of messages — please wait a few minutes, or email Phoun directly." },
			{ status: 429, headers: { 'retry-after': '600' } }
		);
	}

	const messages = parse(await request.json().catch(() => null));
	if (!messages) {
		return json({ message: `Please send a message of up to ${MAX_USER_CHARS} characters.` }, { status: 400 });
	}

	// Retrieve with the last two user turns, so follow-ups like "tell me more" keep their topic.
	const userTurns = messages.filter((m) => m.role === 'user');
	const question = userTurns.at(-1)!.content;
	const query = userTurns
		.slice(-2)
		.map((m) => m.content)
		.join('\n');

	const found = await retrieve(query, g);
	const sources = found.matches.slice(0, 3).map(({ title, href }) => ({ title, href }));

	let stream: Stream | null = null;
	if (g) {
		try {
			stream = await streamAnswer({
				ai: g.ai,
				models: g.models,
				messages,
				context: found.chunks,
				signal: AbortSignal.any([request.signal, AbortSignal.timeout(ANSWER_TIMEOUT_MS)])
			});
		} catch (e) {
			console.error('[chat] Gemini request failed, using fallback:', (e as Error).message);
		}
	} else {
		console.warn('[chat] GEMINI_API_KEY is not set — using rule-based answers.');
	}

	const headers = {
		'content-type': 'text/plain; charset=utf-8',
		'cache-control': 'no-store',
		'x-chat-mode': stream ? 'ai' : 'fallback',
		'x-chat-sources': encodeURIComponent(JSON.stringify(sources))
	};

	if (!stream) return new Response(fallbackAnswer(question, found.matches), { headers });

	const answer = stream;
	const encoder = new TextEncoder();
	const body = new ReadableStream<Uint8Array>({
		async start(controller) {
			let wrote = false;
			try {
				for await (const part of answer) {
					const text = part.text;
					if (text) {
						controller.enqueue(encoder.encode(text));
						wrote = true;
					}
				}
				if (!wrote) controller.enqueue(encoder.encode(fallbackAnswer(question, found.matches)));
			} catch (e) {
				if (request.signal.aborted) return; // visitor closed the connection; nothing to send
				console.error('[chat] stream interrupted:', (e as Error).message);
				const note = wrote
					? '\n\n(The answer was cut off — please ask again.)'
					: fallbackAnswer(question, found.matches);
				try {
					controller.enqueue(encoder.encode(note));
				} catch {
					return; // stream already cancelled
				}
			}
			try {
				controller.close();
			} catch {
				/* already cancelled */
			}
		},
		async cancel() {
			await answer.return(undefined);
		}
	});
	return new Response(body, { headers });
};
