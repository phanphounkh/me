<script lang="ts">
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import BrandIcon from '#lib/components/ui/BrandIcon.svelte';
	import StatusBadge from '#lib/components/ui/StatusBadge.svelte';
	import type { CompactProject } from '#lib/content/types.ts';

	let { project }: { project: CompactProject } = $props();
</script>

<article class="card flex h-full flex-col p-5 transition-colors hover:border-line-strong">
	<div class="flex items-start justify-between gap-3">
		<h4 class="font-semibold tracking-tight text-fg">{project.title}</h4>
		<StatusBadge status={project.status} />
	</div>
	<p class="mt-1 font-mono text-[0.6875rem] tracking-[0.1em] text-subtle uppercase">{project.context}</p>
	<p class="mt-3 text-sm leading-relaxed text-muted">{project.summary}</p>
	<ul class="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies">
		{#each project.tech as t (t)}<li class="tag">{t}</li>{/each}
	</ul>
	<div class="mt-auto flex flex-wrap gap-2 pt-5">
		{#if project.repo}
			<a class="btn btn-secondary btn-sm" href={project.repo} target="_blank" rel="noopener">
				<BrandIcon name="github" size={15} /> Code<span class="sr-only"> for {project.title} (opens in a new tab)</span>
			</a>
		{/if}
		{#if project.live}
			<a class="btn btn-ghost btn-sm" href={project.live} target="_blank" rel="noopener">
				<ExternalLink size={15} aria-hidden="true" /> Live site<span class="sr-only">
					for {project.title} (opens in a new tab)
				</span>
			</a>
		{/if}
	</div>
</article>
