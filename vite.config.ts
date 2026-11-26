import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import adapter from '@sveltejs/adapter-vercel';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	server: { port: 5173 },
	preview: { port: 4173 },
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Runes mode for project files; libraries decide for themselves.
				runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
			},
			// Every page is still prerendered to static HTML (see src/routes/+layout.ts). The only
			// server code is the chat endpoint (src/routes/api/chat/), which runs as a Vercel Function
			// so the Gemini API key never reaches the browser. Output: .vercel/output/.
			// Inline the page CSS (~60 kB, ~12 kB gzipped) to remove render-blocking requests.
			inlineStyleThreshold: 100_000,
			adapter: adapter(),
			prerender: {
				// /og/ is not linked from any page; it is rendered to og.png by `npm run cv`.
				entries: ['*', '/og/'],
				// Broken internal links fail the build. The only exception: while `npm run cv`
				// bootstraps (CV_BOOTSTRAP=1), the CV PDF and its preview image don't exist yet.
				handleHttpError: ({ path, message }) => {
					const generated = path.startsWith('/files/') || path.startsWith('/images/cv-preview');
					if (process.env.CV_BOOTSTRAP === '1' && generated) return;
					throw new Error(message);
				},
				handleMissingId: 'fail'
			}
		})
	]
});
