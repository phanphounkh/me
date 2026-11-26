<script lang="ts">
	import Picture from '#lib/components/ui/Picture.svelte';
	import type { Cover } from '#lib/content/types.ts';
	import CoverArt from './CoverArt.svelte';

	let {
		cover,
		sizes = '(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw',
		eager = false
	}: {
		cover: Cover;
		sizes?: string;
		eager?: boolean;
	} = $props();
</script>

{#if cover.kind === 'image'}
	<Picture
		base={cover.base}
		alt={cover.alt}
		widths={[640, 1100]}
		width={1100}
		height={688}
		{sizes}
		loading={eager ? 'eager' : 'lazy'}
		class="h-full w-full object-cover"
		style={cover.position && `object-position: ${cover.position}`}
	/>
{:else}
	<CoverArt motif={cover.motif} />
{/if}
