<script lang="ts">
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import CirclePlay from '@lucide/svelte/icons/circle-play';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import Lock from '@lucide/svelte/icons/lock';
	import BrandIcon from '#lib/components/ui/BrandIcon.svelte';
	import StatusBadge from '#lib/components/ui/StatusBadge.svelte';
	import type { Project } from '#lib/content/types.ts';
	import ProjectCover from './ProjectCover.svelte';

	let { project, featured = false }: { project: Project; featured?: boolean } = $props();
	const shownTech = $derived(project.tech.slice(0, featured ? 6 : 4));
	const moreTech = $derived(project.tech.length - shownTech.length);
</script>

<article class="pcard group" class:featured>
	<div class="cover">
		<ProjectCover cover={project.cover} />
		<div class="absolute top-3 left-3"><StatusBadge status={project.status} class="badge-on-cover" /></div>
		{#if project.demo}
			<span class="video-chip badge-on-cover absolute top-3 right-3">
				<CirclePlay size={12} aria-hidden="true" /> Video demo
			</span>
		{/if}
	</div>

	<div class="flex flex-1 flex-col p-5 sm:p-6">
		<p class="font-mono text-[0.6875rem] tracking-[0.12em] text-subtle uppercase">{project.context}</p>
		<h3 class="mt-2 text-lg font-semibold tracking-tight text-fg">
			<a href="/projects/{project.slug}" class="stretched focus-visible:outline-none">
				{project.title}
			</a>
		</h3>
		<p class="mt-2 text-sm leading-relaxed text-muted">{project.tagline}</p>
		{#if featured}
			<p class="mt-3 hidden text-sm leading-relaxed text-subtle lg:block">{project.summary}</p>
		{/if}

		<ul class="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies">
			{#each shownTech as t (t)}<li class="tag">{t}</li>{/each}
			{#if moreTech > 0}<li class="tag">+{moreTech}</li>{/if}
		</ul>

		<div class="mt-auto flex items-center justify-between gap-3 pt-6">
			<span class="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium whitespace-nowrap text-accent">
				Case study
				<ArrowUpRight
					size={16}
					aria-hidden="true"
					class="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
				/>
			</span>
			<div class="flex flex-wrap items-center justify-end gap-x-2 gap-y-1">
				{#if project.live}
					<a
						href={project.live}
						target="_blank"
						rel="noopener"
						class="relative z-10 inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm whitespace-nowrap text-muted hover:bg-surface-hover hover:text-fg"
					>
						<ExternalLink size={15} aria-hidden="true" />
						{project.liveLabel ?? 'Live demo'}<span class="sr-only"> (opens in a new tab)</span>
					</a>
				{/if}
				{#if project.repo}
					<a
						href={project.repo}
						target="_blank"
						rel="noopener"
						class="relative z-10 inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm text-muted hover:bg-surface-hover hover:text-fg"
					>
						<BrandIcon name="github" size={15} /> Code<span class="sr-only">
							for {project.title} on GitHub (opens in a new tab)
						</span>
					</a>
				{:else if project.privateNote}
					<span
						class="inline-flex items-center gap-1.5 text-xs whitespace-nowrap text-subtle"
						title={project.privateNote}
					>
						<Lock size={13} aria-hidden="true" /> Private
					</span>
				{/if}
			</div>
		</div>
	</div>
</article>

<style>
	.pcard {
		position: relative;
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: hidden;
		border-radius: 1.25rem;
		border: 1px solid var(--line);
		background: var(--surface);
		box-shadow: var(--shadow);
		transition:
			border-color 220ms ease,
			transform 320ms var(--ease-out-soft),
			box-shadow 320ms ease;
	}
	.pcard:hover,
	.pcard:focus-within {
		border-color: color-mix(in srgb, var(--accent) 55%, var(--line));
		transform: translateY(-4px);
		box-shadow:
			var(--shadow),
			0 30px 60px -36px var(--glow-1);
	}
	.pcard:has(.stretched:focus-visible) {
		outline: 2px solid var(--accent-2);
		outline-offset: 3px;
	}
	.cover {
		position: relative;
		aspect-ratio: 16 / 10;
		overflow: hidden;
		border-bottom: 1px solid var(--line);
		background: var(--bg-2);
	}
	.cover :global(img),
	.cover :global(svg) {
		transition: transform 700ms var(--ease-out-soft);
	}
	.pcard:hover .cover :global(img),
	.pcard:hover .cover :global(svg) {
		transform: scale(1.035);
	}
	.video-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.2rem 0.6rem 0.2rem 0.5rem;
		border-radius: 999px;
		border: 1px solid var(--line);
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		line-height: 1.1rem;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--fg);
		white-space: nowrap;
	}
	.cover :global(.badge-on-cover) {
		background: color-mix(in srgb, var(--surface-strong) 82%, transparent);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
	}
	/* The title link covers the whole card; other links sit above it (z-10). */
	.stretched::after {
		content: '';
		position: absolute;
		inset: 0;
		z-index: 1;
	}
	@media (min-width: 1024px) {
		.pcard.featured {
			flex-direction: row;
		}
		.pcard.featured .cover {
			flex: 0 0 56%;
			aspect-ratio: auto;
			min-height: 22rem;
			border-bottom: 0;
			border-right: 1px solid var(--line);
		}
		.pcard.featured h3 {
			font-size: 1.5rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.pcard:hover {
			transform: none;
		}
	}
</style>
