/**
 * Precomputes the chat assistant's passage embeddings into src/lib/server/chat/embeddings.json,
 * so the live site only embeds visitors' questions. Run after editing src/lib/content/*.ts:
 *
 *   npm run embeddings        (reads GEMINI_API_KEY from the environment or .env)
 *
 * Skipping it is safe: changed passages are then embedded at runtime, once per server instance.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { GoogleGenAI } from '@google/genai';
import {
	chunkHash,
	DIMENSIONS,
	embed,
	embedText,
	encodeVector,
	type StoredIndex
} from '#lib/server/chat/embeddings.ts';
import { chunks } from '#lib/server/chat/knowledge.ts';

const FILE = 'src/lib/server/chat/embeddings.json';

try {
	process.loadEnvFile('.env');
} catch {
	/* no .env — use the environment */
}
const key = process.env.GEMINI_API_KEY?.trim();
if (!key) {
	console.error('GEMINI_API_KEY is not set (add it to .env or the environment).');
	process.exit(1);
}
const model = process.env.GEMINI_EMBEDDING_MODEL?.trim() || 'gemini-embedding-001';

const previous = JSON.parse(readFileSync(FILE, 'utf8')) as StoredIndex;
const reusable = previous.model === model && previous.dimensions === DIMENSIONS;
const todo = chunks.filter((c) => !reusable || previous.chunks[c.id]?.hash !== chunkHash(c));

const next: StoredIndex = { model, dimensions: DIMENSIONS, chunks: {} };
const vectors = todo.length
	? await embed(new GoogleGenAI({ apiKey: key }), model, todo.map(embedText), 'RETRIEVAL_DOCUMENT')
	: [];
for (const c of chunks) {
	const i = todo.indexOf(c);
	next.chunks[c.id] = i >= 0 ? { hash: chunkHash(c), vector: encodeVector(vectors[i]!) } : previous.chunks[c.id]!;
}

writeFileSync(FILE, JSON.stringify(next, null, '\t') + '\n');
console.log(
	`✓ ${chunks.length} passages indexed (${todo.length} embedded, ${chunks.length - todo.length} unchanged) → ${FILE}`
);
