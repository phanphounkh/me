/**
 * Tiny, safe Markdown subset for chat answers: paragraphs, "- " / "1." lists, **bold**, `code`,
 * [links](url), bare URLs and email addresses. All text is HTML-escaped first, and only
 * http(s), mailto, tel and same-site links are allowed, so model output can never inject markup.
 */

const escape = (s: string) =>
	s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

function link(href: string, label: string) {
	const safe = /^(https?:\/\/|mailto:|tel:|\/(?!\/))/i.test(href);
	if (!safe) return label;
	const external = /^https?:\/\//i.test(href);
	return `<a href="${href}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${label}</a>`;
}

function inline(text: string) {
	const tokens: string[] = [];
	const keep = (html: string) => `\u0000${tokens.push(html) - 1}\u0000`;
	let s = escape(text)
		.replace(/`([^`]+)`/g, (_, code) => keep(`<code>${code}</code>`))
		.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, href) => keep(link(href, label)))
		// Bare URLs stop at whitespace and at escaped quotes/brackets; trailing punctuation stays text.
		.replace(/\bhttps?:\/\/(?:(?!&(?:quot|#39|lt|gt);)[^\s<])+/g, (match) => {
			const url = match.replace(/[.,;:!?)\]]+$/, '');
			return keep(link(url, url)) + match.slice(url.length);
		})
		.replace(/\b[\w.+-]+@[\w-]+\.[\w.-]*\w/g, (mail) => keep(link(`mailto:${mail}`, mail)));
	s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/(^|[^*\w])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>');
	return s.replace(/\u0000(\d+)\u0000/g, (_, i) => tokens[Number(i)] ?? '');
}

export function formatMessage(text: string): string {
	const blocks: { kind: 'p' | 'ul' | 'ol'; lines: string[] }[] = [];
	let blankBefore = true;
	for (const raw of text.split('\n')) {
		const line = raw.trim();
		if (!line) {
			blankBefore = true;
			continue;
		}
		const item = /^(?:([-*•])|\d+[.)])\s+(.*)$/.exec(line);
		const kind = item ? (item[1] ? 'ul' : 'ol') : 'p';
		const content = item ? (item[2] ?? '') : line.replace(/^#{1,6}\s+/, '');
		const last = blocks.at(-1);
		// Lines continue the previous block unless they start a different kind, or a new paragraph.
		if (last?.kind === kind && (kind !== 'p' || !blankBefore)) last.lines.push(content);
		else blocks.push({ kind, lines: [content] });
		blankBefore = false;
	}
	return blocks
		.map((b) =>
			b.kind === 'p'
				? `<p>${b.lines.map(inline).join('<br>')}</p>`
				: `<${b.kind}>${b.lines.map((l) => `<li>${inline(l)}</li>`).join('')}</${b.kind}>`
		)
		.join('');
}
