/**
 * Scroll-triggered reveal. Usage: <div use:reveal> or <div use:reveal={120}> (delay in ms).
 *
 * Never measures layout synchronously (no getBoundingClientRect on mount — that forces a
 * reflow per element during hydration). The first IntersectionObserver callback decides:
 *   - already on screen (or above it) → stays visible, nothing is ever hidden;
 *   - below the fold → hidden now, revealed when it scrolls into view.
 * The hidden state only applies when JS runs and motion is allowed (see app.css), and print
 * always shows everything.
 */
export function reveal(node: HTMLElement, delay = 0) {
	if (delay) node.style.setProperty('--reveal-delay', `${delay}ms`);
	if (typeof IntersectionObserver === 'undefined') return {};

	let first = true;
	const passed = (entry: IntersectionObserverEntry) => entry.isIntersecting || entry.boundingClientRect.top < 0;

	const io = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (first) {
					first = false;
					if (passed(entry)) {
						// Visible from the start: never hidden. The class still triggers decorative
						// effects that key off it (timeline fill, OCR boxes drawing in).
						node.classList.add('is-revealed');
						io.disconnect();
						return;
					}
					node.dataset.reveal = ''; // off-screen: hide until it arrives
					continue;
				}
				// Reveal on arrival — or when skipped past (fast scroll, End key, anchor jump).
				if (passed(entry)) {
					node.classList.add('is-revealed');
					io.disconnect();
				}
			}
		},
		{ rootMargin: '0px 0px -6% 0px', threshold: 0.05 }
	);
	io.observe(node);

	return {
		destroy() {
			io.disconnect();
		}
	};
}
