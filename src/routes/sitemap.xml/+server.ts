import { SITE_URL } from '#lib/content/profile.ts';
import { projects } from '#lib/content/projects.ts';

export const prerender = true;
export const trailingSlash = 'never';

const LAST_MOD = '2026-11-20';

export function GET() {
	const paths = ['/', '/cv/', ...projects.map((p) => `/projects/${p.slug}/`)];
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${SITE_URL}${p}</loc><lastmod>${LAST_MOD}</lastmod></url>`).join('\n')}
</urlset>
`;
	return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
