/**
 * Retrieval for the chatbot (the "R" in RAG).
 *
 * - Semantic: passage vectors are precomputed with Gemini embeddings (`npm run embeddings` →
 *   embeddings.json); only passages edited since then are embedded at runtime (once per instance).
 *   Each question is embedded (one request) and passages are ranked by cosine similarity.
 * - Keyword: BM25 over the same chunks. Blended into the semantic score (so names like "TrOCR" or
 *   "DC-CAM" still match exactly), and used on its own when Gemini is unavailable.
 */
import type { GoogleGenAI } from '@google/genai';
import { chunkHash, decodeVector, DIMENSIONS, embed, embedText, type StoredIndex } from './embeddings.ts';
import stored from './embeddings.json' with { type: 'json' };
import { chunks, type Chunk } from './knowledge.ts';

/** Always sent to the model: who Phoun is and how to reach him. Small, and relevant to most questions. */
const CORE_IDS = ['profile', 'contact'];
const TOP_K = 6;
const RETRY_AFTER_FAILURE_MS = 60_000;

// ── Keyword search (BM25) ─────────────────────────────────────────────────

const STOPWORDS = new Set(
	'a an and are as at be but by can could did do does for from had has have he her him his how i if in into is it its me my of on or our she so tell than that the their them then there these they this to was we were what when where which who why will with would you your about phoun phan now right currently current really also any some more much very just get got like know please give show list describe explain talk doing done want should thing things anything something'.split(
		' '
	)
);

/** Very light stemming, so "studied", "studies" and "study" or "projects" and "project" match. */
function stem(t: string) {
	if (t.length > 4 && /(ied|ies)$/.test(t)) return t.slice(0, -3) + 'y';
	if (t.length > 4 && t.endsWith('s') && !t.endsWith('ss')) return t.slice(0, -1);
	return t;
}

export function tokenize(text: string): string[] {
	return (text.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [])
		.filter((t) => !STOPWORDS.has(t) && (t.length > 1 || /\p{N}/u.test(t)))
		.map(stem);
}

const docTokens = chunks.map((c) => tokenize(`${c.title} ${c.text}`));
const titleTokens = chunks.map((c) => new Set(tokenize(c.title)));
const avgLength = docTokens.reduce((n, d) => n + d.length, 0) / docTokens.length;
const docFreq = new Map<string, number>();
for (const tokens of docTokens) for (const t of new Set(tokens)) docFreq.set(t, (docFreq.get(t) ?? 0) + 1);

function bm25(query: string): number[] {
	const terms = [...new Set(tokenize(query))];
	const n = chunks.length;
	return docTokens.map((tokens, i) => {
		let score = 0;
		for (const term of terms) {
			const tf = tokens.filter((t) => t === term).length;
			if (!tf) continue;
			const df = docFreq.get(term) ?? 0;
			const idf = Math.log(1 + (n - df + 0.5) / (df + 0.5));
			score += (idf * tf * 2.2) / (tf + 1.2 * (0.25 + (0.75 * tokens.length) / avgLength));
			if (titleTokens[i]!.has(term)) score += idf; // a match in the title says more than one in the body
		}
		return score;
	});
}

// ── Semantic search (Gemini embeddings) ───────────────────────────────────

let index: Promise<number[][]> | null = null;
let failedAt = 0;

/** Precomputed vectors where the passage is unchanged; embeds only the rest. */
async function buildIndex(ai: GoogleGenAI, model: string): Promise<number[][]> {
	const index = stored as StoredIndex;
	const usable = index.model === model && index.dimensions === DIMENSIONS;
	const vectors = chunks.map((c) => {
		const saved = usable ? index.chunks[c.id] : undefined;
		return saved?.hash === chunkHash(c) ? decodeVector(saved.vector) : null;
	});
	const missing = chunks.flatMap((c, i) => (vectors[i] ? [] : [i]));
	if (missing.length > 0) {
		console.warn(`[chat] embedding ${missing.length} passage(s) changed since \`npm run embeddings\`.`);
		const fresh = await embed(
			ai,
			model,
			missing.map((i) => embedText(chunks[i]!)),
			'RETRIEVAL_DOCUMENT'
		);
		missing.forEach((chunkIndex, k) => (vectors[chunkIndex] = fresh[k]!));
	}
	return vectors as number[][];
}

function chunkIndex(ai: GoogleGenAI, model: string) {
	if (!index && Date.now() - failedAt > RETRY_AFTER_FAILURE_MS) {
		index = buildIndex(ai, model).catch((error) => {
			index = null;
			failedAt = Date.now();
			throw error;
		});
	}
	return index;
}

function cosine(a: number[], b: number[]) {
	let dot = 0;
	let na = 0;
	let nb = 0;
	a.forEach((x, i) => {
		const y = b[i] ?? 0;
		dot += x * y;
		na += x * x;
		nb += y * y;
	});
	return dot / (Math.sqrt(na * nb) || 1);
}

/** Scales scores to 0–1 so semantic and keyword scores can be blended. */
function normalise(scores: number[]) {
	const min = Math.min(...scores);
	const max = Math.max(...scores);
	return scores.map((s) => (max > min ? (s - min) / (max - min) : 0));
}

// ── Public API ────────────────────────────────────────────────────────────

export interface Retrieval {
	/** Core chunks first, then the best matches. */
	chunks: Chunk[];
	/** The best matches only (excluding core chunks unless they matched) — shown as sources. */
	matches: Chunk[];
	mode: 'semantic' | 'keyword';
}

export async function retrieve(
	query: string,
	gemini: { ai: GoogleGenAI; embeddingModel: string } | null
): Promise<Retrieval> {
	const keyword = bm25(query);
	let scores = normalise(keyword).map((s, i) => (keyword[i]! > 0 ? s : -1));
	let mode: Retrieval['mode'] = 'keyword';

	if (gemini) {
		try {
			const docs = await chunkIndex(gemini.ai, gemini.embeddingModel);
			if (docs) {
				const [q = []] = await embed(gemini.ai, gemini.embeddingModel, [query], 'RETRIEVAL_QUERY');
				const semantic = normalise(docs.map((d) => cosine(q, d)));
				const kw = normalise(keyword);
				scores = semantic.map((s, i) => 0.7 * s + 0.3 * kw[i]!);
				mode = 'semantic';
			}
		} catch (error) {
			console.error('[chat] embedding failed, using keyword retrieval:', (error as Error).message);
		}
	}

	const ranked = chunks
		.map((chunk, i) => ({ chunk, score: scores[i]! }))
		.filter((r) => r.score > (mode === 'semantic' ? 0.35 : 0))
		.sort((a, b) => b.score - a.score)
		.slice(0, TOP_K)
		.map((r) => r.chunk);

	const core = chunks.filter((c) => CORE_IDS.includes(c.id) && !ranked.includes(c));
	return { chunks: [...core, ...ranked], matches: ranked, mode };
}
