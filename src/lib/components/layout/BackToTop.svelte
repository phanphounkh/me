<script lang="ts">
	import ArrowUp from '@lucide/svelte/icons/arrow-up';

	let visible = $state(false);

	$effect(() => {
		const onScroll = () => (visible = window.scrollY > 900);
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	function toTop() {
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
		// Move focus to the start of the page for keyboard and screen-reader users.
		document.getElementById('main')?.focus({ preventScroll: true });
	}
</script>

<button
	type="button"
	class="icon-btn back-to-top"
	class:visible
	onclick={toTop}
	aria-label="Back to top"
	tabindex={visible ? 0 : -1}
	aria-hidden={!visible}
>
	<ArrowUp size={18} aria-hidden="true" />
</button>

<style>
	.back-to-top {
		position: fixed;
		right: 1rem;
		bottom: 1rem;
		z-index: 40;
		background: color-mix(in srgb, var(--surface-strong) 88%, transparent);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		box-shadow: var(--shadow);
		opacity: 0;
		transform: translateY(8px);
		pointer-events: none;
		transition:
			opacity 200ms ease,
			transform 200ms var(--ease-out-soft),
			color 150ms ease;
	}
	.back-to-top.visible {
		opacity: 1;
		transform: none;
		pointer-events: auto;
	}
	@media (min-width: 640px) {
		.back-to-top {
			right: 1.5rem;
			bottom: 1.5rem;
		}
	}
	@media print {
		.back-to-top {
			display: none;
		}
	}
</style>
