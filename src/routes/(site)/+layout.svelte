<script lang="ts">
	import ChatWidget from '#lib/components/chat/ChatWidget.svelte';
	import BackToTop from '#lib/components/layout/BackToTop.svelte';
	import Footer from '#lib/components/layout/Footer.svelte';
	import Navbar from '#lib/components/layout/Navbar.svelte';

	let { children } = $props();
</script>

<a href="#main" class="skip-link">Skip to content</a>
<Navbar />
<main id="main" tabindex="-1" class="outline-none">
	{@render children()}
</main>
<Footer />
<BackToTop />
<ChatWidget />

<style>
	.skip-link {
		position: fixed;
		left: 1rem;
		top: 0.75rem;
		z-index: 100;
		padding: 0.6rem 1rem;
		border-radius: 0.6rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--btn-fg);
		background: var(--btn-bg);
		transform: translateY(-160%);
		transition: transform 150ms ease;
	}
	.skip-link:focus {
		transform: none;
	}
</style>
