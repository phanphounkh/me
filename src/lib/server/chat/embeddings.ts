/**
 * Shared embedding helpers for the chat index — used at runtime (retrieve.ts) and by
 * `npm run embeddings` (scripts/embed-knowledge.ts), which precomputes every passage's vector into
 * embeddings.json so a server instance never re-embeds the whole knowledge base on start-up.
 * (On the Gemini free tier every passage in a batch counts as one request, 100 per minute.)
 */
import { createHash } from 'node:crypto';
import type { GoogleGenAI } from '@google/genai';
import type { Chunk } from './knowledge.ts';

/** Small corpus, so a compact vector is plenty; queries must use the same size. */
export const DIMENSIONS = 768;

export interface StoredIndex {
	model: string;
	dimensions: number;
	/** Per chunk id: hash of the embedded text, and the vector as base64 Float32. */
	chunks: Record<string, { hash: string; vector: string }>;
}

export const embedText = (c: Chunk) => `${c.title}\n${c.text}`;
export const chunkHash = (c: Chunk) => createHash('sha256').update(embedText(c)).digest('hex').slice(0, 16);

export const encodeVector = (v: number[]) => Buffer.from(new Float32Array(v).buffer).toString('base64');
export const decodeVector = (s: string) =>
	Array.from(new Float32Array(new Uint8Array(Buffer.from(s, 'base64')).buffer));

export async function embed(ai: GoogleGenAI, model: string, texts: string[], taskType: string): Promise<number[][]> {
	const out: number[][] = [];
	for (let i = 0; i < texts.length; i += 100) {
		const batch = texts.slice(i, i + 100);
		const res = await ai.models.embedContent({
			model,
			contents: batch,
			config: { taskType, outputDimensionality: DIMENSIONS }
		});
		const vectors = res.embeddings?.map((e) => e.values ?? []) ?? [];
		if (vectors.length !== batch.length || vectors.some((v) => v.length === 0)) {
			throw new Error('Embedding response is incomplete');
		}
		out.push(...vectors);
	}
	return out;
}
