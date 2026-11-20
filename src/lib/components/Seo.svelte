<script lang="ts">
	import { SITE_URL, profile } from '#lib/content/profile.ts';

	interface Props {
		title: string;
		description: string;
		path: string;
		image?: string;
		type?: 'website' | 'profile' | 'article';
		noindex?: boolean;
		jsonLd?: Record<string, unknown> | Record<string, unknown>[];
	}
	let { title, description, path, image = '/og.png', type = 'website', noindex = false, jsonLd }: Props = $props();

	const url = $derived(new URL(path, SITE_URL).href);
	const imageUrl = $derived(new URL(image, SITE_URL).href);
	// Built safely: JSON is serialised and `<` escaped so content can never close the script tag.
	const ldJson = $derived(jsonLd ? JSON.stringify(jsonLd).replace(/</g, '\\u003c') : '');
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />
	<meta name="author" content={profile.name} />
	{#if noindex}<meta name="robots" content="noindex, nofollow" />{/if}

	<meta property="og:type" content={type} />
	<meta property="og:site_name" content="{profile.name} — Portfolio" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="{profile.name} — {profile.shortTitle}" />
	<meta property="og:locale" content="en_US" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />

	{#if ldJson}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html `<script type="application/ld+json">${ldJson}</script>`}
	{/if}
</svelte:head>
