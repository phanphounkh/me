<script lang="ts">
	import { page } from '$app/state';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import Logo from '#lib/components/layout/Logo.svelte';

	const notFound = $derived(page.status === 404);
</script>

<svelte:head>
	<title>{notFound ? 'Page not found' : 'Something went wrong'} — Phoun Phan</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="grid min-h-dvh place-items-center px-4">
	<div class="max-w-md text-center">
		<div class="flex justify-center"><Logo /></div>
		<p class="mt-10 font-mono text-sm text-accent-2">{page.status}</p>
		<h1 class="mt-3 text-3xl font-semibold tracking-tight text-fg">
			{notFound ? 'This page could not be found.' : 'Something went wrong.'}
		</h1>
		<p class="mt-3 text-muted">
			{notFound ? 'The link may be outdated, or the page has moved.' : 'Please try again in a moment.'}
		</p>
		<a href="/" class="btn btn-primary mt-8"><ArrowLeft size={17} aria-hidden="true" /> Back to the portfolio</a>
	</div>
</div>
