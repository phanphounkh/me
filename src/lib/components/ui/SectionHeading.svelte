<script lang="ts">
	import type { Snippet } from 'svelte';
	import { reveal } from '#lib/actions/reveal.ts';

	interface Props {
		id: string;
		index: string;
		eyebrow: string;
		title: string;
		intro?: string;
		children?: Snippet;
		align?: 'left' | 'center';
	}
	let { id, index, eyebrow, title, intro, children, align = 'left' }: Props = $props();
</script>

<header class="max-w-3xl" class:mx-auto={align === 'center'} class:text-center={align === 'center'} use:reveal>
	<p class="eyebrow flex items-center gap-3" class:justify-center={align === 'center'}>
		<span class="text-subtle">{index}</span>
		<span class="h-px w-8 bg-line-strong" aria-hidden="true"></span>
		<span>{eyebrow}</span>
	</p>
	<h2
		id="{id}-title"
		class="mt-4 text-3xl font-semibold tracking-tight text-fg sm:text-4xl md:text-[2.75rem] md:leading-[1.1]"
	>
		{title}
	</h2>
	{#if intro}
		<p class="mt-4 text-base leading-relaxed text-muted sm:text-lg">{intro}</p>
	{/if}
	{@render children?.()}
</header>
