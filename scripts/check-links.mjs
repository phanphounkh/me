/**
 * Verifies every link in the built site (run `npm run build` first):
 *   - internal href/src/srcset targets exist in build/
 *   - #fragment targets exist on the destination page
 *   - external http(s) links respond with a non-error status
 *   - mailto: links are well-formed
 * Exits non-zero on any broken link. Usage: npm run links [-- --offline]
 */
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const BUILD = 'build';
const OFFLINE = process.argv.includes('--offline');

async function walk(dir) {
	const out = [];
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) out.push(...(await walk(full)));
		else out.push(full);
	}
	return out;
}

const exists = async (p) => !!(await stat(p).catch(() => null));

async function resolveInternal(urlPath) {
	const clean = decodeURIComponent(urlPath.split('?')[0]);
	const candidates = clean.endsWith('/')
		? [path.join(BUILD, clean, 'index.html')]
		: [path.join(BUILD, clean), path.join(BUILD, clean + '.html'), path.join(BUILD, clean, 'index.html')];
	for (const c of candidates) if (await exists(c)) return c;
	return null;
}

const pages = (await walk(BUILD)).filter((f) => f.endsWith('.html') && !f.endsWith('404.html'));
const idsCache = new Map();
async function idsOf(file) {
	if (!idsCache.has(file)) {
		const html = await readFile(file, 'utf8');
		idsCache.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
	}
	return idsCache.get(file);
}

const problems = [];
const external = new Map(); // url -> [pages]
let internalCount = 0;

for (const file of pages) {
	const html = await readFile(file, 'utf8');
	const pagePath =
		'/' +
		path
			.relative(BUILD, file)
			.replace(/index\.html$/, '')
			.replace(/\.html$/, '');
	const refs = [
		...[...html.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((m) => m[1]),
		...[...html.matchAll(/\ssrcset="([^"]+)"/g)].flatMap((m) => m[1].split(',').map((s) => s.trim().split(/\s+/)[0]))
	];
	for (const raw of refs) {
		const ref = raw.replaceAll('&amp;', '&');
		if (ref.startsWith('mailto:')) {
			if (!/^mailto:[^@\s]+@[^@\s]+\.[a-z]{2,}(\?.*)?$/i.test(ref)) problems.push(`${pagePath}: malformed ${ref}`);
			continue;
		}
		if (/^https?:\/\//.test(ref)) {
			if (ref.startsWith('https://www.camdev.site')) continue; // canonical/OG URLs of the site itself
			if (!external.has(ref)) external.set(ref, []);
			external.get(ref).push(pagePath);
			continue;
		}
		if (ref.startsWith('data:') || ref.startsWith('javascript:')) continue;
		internalCount++;
		const [target, fragment] = ref.startsWith('#') ? [pagePath, ref.slice(1)] : ref.split('#');
		const abs = target.startsWith('/') ? target : path.posix.join(pagePath, target);
		const resolved = await resolveInternal(abs);
		if (!resolved) {
			problems.push(`${pagePath}: missing ${ref}`);
			continue;
		}
		if (fragment && resolved.endsWith('.html') && !(await idsOf(resolved)).has(fragment)) {
			problems.push(`${pagePath}: no #${fragment} on ${abs}`);
		}
	}
}

console.log(`Checked ${pages.length} pages, ${internalCount} internal references.`);

if (!OFFLINE) {
	console.log(`Checking ${external.size} external URLs…`);
	await Promise.all(
		[...external.keys()].map(async (url) => {
			const attempt = async (method) =>
				fetch(url, {
					method,
					redirect: 'follow',
					signal: AbortSignal.timeout(20000),
					headers: { 'User-Agent': 'Mozilla/5.0 (link-check)' }
				});
			try {
				let res = await attempt('HEAD');
				if (res.status === 405 || res.status === 403) res = await attempt('GET');
				// LinkedIn answers every automated request with 999 — it can't be checked by script.
				if (res.status === 999) {
					console.log(`  ?   999 ${url} (site blocks automated checks — verify by hand)`);
					return;
				}
				const flag = res.ok ? 'ok ' : 'ERR';
				console.log(`  ${flag} ${res.status} ${url}`);
				if (!res.ok) problems.push(`external ${res.status}: ${url} (on ${external.get(url).join(', ')})`);
			} catch (e) {
				console.log(`  ERR ---  ${url} (${e.cause?.code ?? e.name})`);
				problems.push(`external unreachable: ${url}`);
			}
		})
	);
}

if (problems.length) {
	console.error(`\n✗ ${problems.length} problem(s):\n  ` + [...new Set(problems)].join('\n  '));
	process.exit(1);
}
console.log('\n✓ All links resolve.');
