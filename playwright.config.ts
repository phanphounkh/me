import { defineConfig } from '@playwright/test';

// Runs against the production build (`npm run build` first). Uses the installed Google Chrome,
// so no browser download is needed.
export default defineConfig({
	testDir: 'tests',
	fullyParallel: true,
	reporter: [['list']],
	use: {
		baseURL: 'http://localhost:4320',
		channel: 'chrome',
		trace: 'retain-on-failure'
	},
	webServer: {
		command: 'npx vite preview --port 4320 --strictPort',
		url: 'http://localhost:4320/',
		reuseExistingServer: false,
		timeout: 30_000
	},
	projects: [
		{ name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
		{ name: 'mobile', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } }
	]
});
