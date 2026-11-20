import { SITE_URL } from '#lib/content/profile.ts';

export const prerender = true;
export const trailingSlash = 'never';

export function GET() {
	const body = `User-agent: *
Allow: /
Disallow: /og/

Sitemap: ${SITE_URL}/sitemap.xml
`;
	return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
}
