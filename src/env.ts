import { defineEnvVars } from '@sveltejs/kit/env';

/**
 * Server-only environment variables (imported from `$app/env/private`, read when the app starts).
 * Set them in `.env` locally (see `.env.example`) and in Vercel → Project → Settings → Environment Variables.
 */
export const variables = defineEnvVars({
	GEMINI_API_KEY: {
		description:
			'Google Gemini API key for the chat assistant (https://aistudio.google.com/apikey). Without it the assistant answers in rule-based offline mode.',
		schema: (value) => value?.trim() || undefined
	},
	GEMINI_MODEL: {
		description: 'Gemini model that writes chat answers.',
		schema: (value) => value?.trim() || 'gemini-3.5-flash'
	},
	GEMINI_BACKUP_MODEL: {
		description: 'Model tried when the main one is overloaded, rate-limited or retired.',
		schema: (value) => value?.trim() || 'gemini-3.5-flash-lite'
	},
	GEMINI_EMBEDDING_MODEL: {
		description: 'Gemini embedding model used to retrieve portfolio passages (RAG).',
		schema: (value) => value?.trim() || 'gemini-embedding-001'
	}
});
