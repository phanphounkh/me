<script lang="ts">
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
	import { reveal } from '#lib/actions/reveal.ts';
	import CompactCard from '#lib/components/project/CompactCard.svelte';
	import ProjectCard from '#lib/components/project/ProjectCard.svelte';
	import SectionHeading from '#lib/components/ui/SectionHeading.svelte';
	import { categoryLabels, earlierWork, moreAiWork, projects } from '#lib/content/projects.ts';
	import type { ProjectCategory } from '#lib/content/types.ts';

	type Filter = 'all' | ProjectCategory;
	let filter = $state<Filter>('all');

	// Only offer filters that match at least one project.
	const filters: { id: Filter; label: string; count: number }[] = [
		{ id: 'all', label: 'All', count: projects.length },
		...(Object.keys(categoryLabels) as ProjectCategory[])
			.map((id) => ({ id, label: categoryLabels[id], count: projects.filter((p) => p.categories.includes(id)).length }))
			.filter((f) => f.count > 0)
	];

	const visible = $derived(
		filter === 'all' ? projects : projects.filter((p) => p.categories.includes(filter as ProjectCategory))
	);

	let motionOk = $state(true);
	$effect(() => {
		motionOk = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	});
</script>

<section id="projects" class="section bg-bg-2" aria-labelledby="projects-title">
	<div class="container-x">
		<SectionHeading
			id="projects"
			index="04"
			eyebrow="Projects"
			title="AI research, computer vision and the software around it."
			intro="Each project is labelled honestly — research, prototype, in development or learning project — and separates what works today from what is planned."
		/>

		<div class="mt-10 flex flex-wrap gap-2" role="group" aria-label="Filter projects by category" use:reveal>
			{#each filters as f (f.id)}
				<button type="button" class="filter" aria-pressed={filter === f.id} onclick={() => (filter = f.id)}>
					{f.label}<span class="count" aria-hidden="true">{f.count}</span>
				</button>
			{/each}
		</div>
		<p class="sr-only" aria-live="polite">{visible.length} projects shown</p>

		<ul class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each visible as project, i (project.slug)}
				<li
					animate:flip={{ duration: motionOk ? 380 : 0 }}
					in:fade={{ duration: motionOk ? 260 : 0 }}
					class={[i === 0 && filter === 'all' && 'lg:col-span-2']}
					use:reveal={(i % 3) * 70}
				>
					<ProjectCard {project} featured={i === 0 && filter === 'all'} />
				</li>
			{/each}
		</ul>

		<div class="mt-20">
			<div class="flex flex-wrap items-end justify-between gap-3" use:reveal>
				<div>
					<h3 class="text-xl font-semibold tracking-tight text-fg">More AI work</h3>
					<p class="mt-1 text-sm text-muted">Public repositories — personal research and AI applications.</p>
				</div>
			</div>
			<ul class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
				{#each moreAiWork as p, i (p.title)}
					<li use:reveal={(i % 3) * 70}><CompactCard project={p} /></li>
				{/each}
			</ul>
		</div>

		<div class="mt-16">
			<div use:reveal>
				<h3 class="text-xl font-semibold tracking-tight text-fg">Earlier web projects</h3>
				<p class="mt-1 text-sm text-muted">
					From my web programming foundation — preserved from my previous portfolio.
				</p>
			</div>
			<ul class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
				{#each earlierWork as p, i (p.title)}
					<li use:reveal={(i % 3) * 70}><CompactCard project={p} /></li>
				{/each}
			</ul>
		</div>
	</div>
</section>

<style>
	.filter {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		min-height: 2.5rem;
		padding: 0.4rem 0.9rem;
		border-radius: 999px;
		font-size: 0.875rem;
		color: var(--muted);
		border: 1px solid var(--line);
		background: var(--surface);
		transition:
			color 150ms ease,
			background-color 150ms ease,
			border-color 150ms ease;
	}
	.filter:hover {
		color: var(--fg);
		border-color: var(--line-strong);
	}
	.filter[aria-pressed='true'] {
		color: var(--btn-fg);
		background: var(--btn-bg);
		border-color: var(--btn-bg);
	}
	.count {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		opacity: 0.7;
	}
</style>
