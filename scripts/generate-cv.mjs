/**
 * Generates the downloadable CV and social card from the built site:
 *   static/files/Phoun-Phan-CV.pdf     — A4, text-selectable, tagged PDF printed from /cv/
 *   static/images/cv-preview-*.{avif,webp} — page-one thumbnail for the Resume section
 *   static/og.png                      — 1200×630 Open Graph image rendered from /og/
 *
 * Requires Google Chrome (Playwright drives it via channel "chrome") and poppler-utils
 * (pdfinfo, pdftotext, pdftoppm). Run with `npm run cv`, then commit the outputs.
 */
import { execFileSync, spawn } from 'node:child_process';
import { mkdir, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { chromium } from '@playwright/test';
import sharp from 'sharp';

const PORT = 4319;
const BASE = `http://localhost:${PORT}`;
const PDF = 'static/files/Phoun-Phan-CV.pdf';

const run = (cmd, args, env = {}) => execFileSync(cmd, args, { stdio: 'inherit', env: { ...process.env, ...env } });

async function waitFor(url, timeoutMs = 30000) {
	const start = Date.now();
	while (Date.now() - start < timeoutMs) {
		try {
			const res = await fetch(url);
			if (res.ok) return;
		} catch {
			/* server not up yet */
		}
		await new Promise((r) => setTimeout(r, 300));
	}
	throw new Error(`Timed out waiting for ${url}`);
}

console.log('› Building (bootstrap mode)…');
run('npx', ['vite', 'build'], { CV_BOOTSTRAP: '1' });

const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' });
let browser;
try {
	await waitFor(`${BASE}/cv/`);
	browser = await chromium.launch({ channel: 'chrome' });
	const page = await browser.newPage();
	// Print with the light theme regardless of defaults, for a predictable PDF.
	await page.addInitScript(() => localStorage.setItem('theme', 'light'));

	console.log('› Printing /cv/ to PDF…');
	await page.goto(`${BASE}/cv/`, { waitUntil: 'networkidle' });
	await page.evaluate(() => document.fonts.ready);
	await mkdir(path.dirname(PDF), { recursive: true });
	await page.pdf({
		path: PDF,
		format: 'A4',
		printBackground: true,
		preferCSSPageSize: true,
		tagged: true,
		outline: true
	});

	console.log('› Rendering social card…');
	await page.setViewportSize({ width: 1200, height: 630 });
	await page.goto(`${BASE}/og/`, { waitUntil: 'networkidle' });
	await page.evaluate(() => document.fonts.ready);
	await page.screenshot({ path: 'static/og.png', clip: { x: 0, y: 0, width: 1200, height: 630 } });
} finally {
	await browser?.close();
	preview.kill();
}

console.log('› Creating CV preview thumbnail…');
const tmp = await mkdtemp(path.join(tmpdir(), 'cv-'));
run('pdftoppm', ['-png', '-r', '110', '-f', '1', '-l', '1', '-singlefile', PDF, path.join(tmp, 'page1')]);
for (const w of [480, 760]) {
	const img = sharp(path.join(tmp, 'page1.png')).resize({ width: w });
	await img.clone().avif({ quality: 60 }).toFile(`static/images/cv-preview-${w}.avif`);
	await img.clone().webp({ quality: 82 }).toFile(`static/images/cv-preview-${w}.webp`);
}
await rm(tmp, { recursive: true, force: true });

console.log('› Verifying PDF…');
const info = execFileSync('pdfinfo', [PDF]).toString();
const pages = Number(/Pages:\s+(\d+)/.exec(info)?.[1]);
const size = /Page size:\s+([^\n]+)/.exec(info)?.[1];
const text = execFileSync('pdftotext', ['-layout', PDF, '-']).toString();
const required = ['PHOUN PHAN', 'SKAI Technology', 'Summary', 'Experience', 'Education', 'Selected Projects'];
const missing = required.filter((s) => !text.toLowerCase().includes(s.toLowerCase()));
console.log(`  pages: ${pages} · size: ${size}`);
if (missing.length) throw new Error(`PDF text is missing: ${missing.join(', ')}`);
if (pages < 1 || pages > 2) throw new Error(`Expected 1–2 pages, got ${pages}`);

console.log('› Final build…');
run('npx', ['vite', 'build']);
console.log(`✓ CV written to ${PDF}`);
