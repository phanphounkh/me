<script lang="ts">
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import CircleCheck from '@lucide/svelte/icons/circle-check';
	import CircleDashed from '@lucide/svelte/icons/circle-dashed';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import Lock from '@lucide/svelte/icons/lock';
	import { reveal } from '#lib/actions/reveal.ts';
	import Seo from '#lib/components/Seo.svelte';
	import ProjectCover from '#lib/components/project/ProjectCover.svelte';
	import BrandIcon from '#lib/components/ui/BrandIcon.svelte';
	import Picture from '#lib/components/ui/Picture.svelte';
	import StatusBadge from '#lib/components/ui/StatusBadge.svelte';
	import { SITE_URL, profile } from '#lib/content/profile.ts';
	import { categoryLabels } from '#lib/content/projects.ts';

	let { data } = $props();
	const p = $derived(data.project);
	const cs = $derived(p.caseStudy);

	const jsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'CreativeWork',
		name: p.title,
		description: p.summary,
		url: `${SITE_URL}/projects/${p.slug}/`,
		author: { '@type': 'Person', name: profile.name, url: SITE_URL },
		keywords: p.tech.join(', '),
		...(p.repo ? { codeRepository: p.repo } : {})
	});
</script>

<Seo
	title="{p.title} — {profile.name}"
	description="{p.tagline} {p.summary}"
	path="/projects/{p.slug}/"
	type="article"
	image={p.cover.kind === 'image' ? `/images/${p.cover.base}-1100.webp` : '/og.png'}
	{jsonLd}
/>

<article class="relative">
	<div class="glow" aria-hidden="true"></div>
	<div class="container-x pt-10 pb-24 sm:pt-14">
		<a href="/#projects" class="inline-flex items-center gap-2 text-sm text-muted hover:text-fg">
			<ArrowLeft size={16} aria-hidden="true" /> All projects
		</a>

		<header class="mt-8 max-w-3xl">
			<div class="flex flex-wrap items-center gap-3">
				<StatusBadge status={p.status} />
				<span class="font-mono text-xs tracking-[0.12em] text-subtle uppercase">{p.context}</span>
			</div>
			<h1 class="mt-4 text-4xl font-semibold tracking-tight text-fg sm:text-5xl">{p.title}</h1>
			<p class="mt-4 text-lg leading-relaxed text-muted sm:text-xl">{p.tagline}</p>

			<div class="mt-7 flex flex-wrap items-center gap-3">
				{#if p.repo}
					<a class="btn btn-primary" href={p.repo} target="_blank" rel="noopener">
						<BrandIcon name="github" size={17} /> View code<span class="sr-only"> (opens in a new tab)</span>
					</a>
				{/if}
				{#if p.live}
					<a class="btn btn-secondary" href={p.live} target="_blank" rel="noopener">
						<ExternalLink size={17} aria-hidden="true" /> Live demo<span class="sr-only"> (opens in a new tab)</span>
					</a>
				{/if}
				{#if p.privateNote}
					<p
						class="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-muted"
					>
						<Lock size={15} aria-hidden="true" class="flex-none" />{p.privateNote}
					</p>
				{/if}
			</div>
		</header>

		<div class="cover mt-10" use:reveal>
			<ProjectCover cover={p.cover} sizes="(min-width: 1200px) 1150px, 100vw" eager />
		</div>

		<div class="mt-14 grid gap-12 lg:grid-cols-[1fr_20rem] lg:gap-16">
			<div class="min-w-0 space-y-12">
				<section aria-labelledby="overview">
					<h2 id="overview" class="h2">Overview</h2>
					<p class="mt-3 text-[1.0625rem] leading-relaxed text-muted">{p.summary}</p>
				</section>

				{#if cs}
					<section aria-labelledby="problem">
						<h2 id="problem" class="h2">Problem</h2>
						<p class="body">{cs.problem}</p>
					</section>
					<section aria-labelledby="motivation">
						<h2 id="motivation" class="h2">Motivation</h2>
						<p class="body">{cs.motivation}</p>
					</section>
					<section aria-labelledby="role">
						<h2 id="role" class="h2">My role</h2>
						<p class="body">{cs.role}</p>
					</section>
					<section aria-labelledby="approach">
						<h2 id="approach" class="h2">Approach</h2>
						<ol class="mt-4 space-y-3">
							{#each cs.approach as step, i (step)}
								<li class="flex gap-4">
									<span class="mt-0.5 font-mono text-xs text-accent-2">{String(i + 1).padStart(2, '0')}</span>
									<span class="leading-relaxed text-muted">{step}</span>
								</li>
							{/each}
						</ol>
					</section>
					{#if cs.architecture}
						<section aria-labelledby="architecture">
							<h2 id="architecture" class="h2">Architecture</h2>
							<p class="mt-2 text-sm text-subtle">
								High-level flow{p.privateNote ? ' — internal details are intentionally omitted' : ''}.
							</p>
							<ol class="flow mt-5" aria-label="Architecture flow">
								{#each cs.architecture as node, i (node)}
									<li class="node">{node}</li>
									{#if i < cs.architecture.length - 1}<li class="arrow" aria-hidden="true">→</li>{/if}
								{/each}
							</ol>
						</section>
					{/if}
				{/if}

				{#if p.implemented?.length || p.planned?.length}
					<section aria-labelledby="features">
						<h2 id="features" class="h2">What works vs. what's planned</h2>
						<div class="mt-5 grid gap-5 sm:grid-cols-2">
							{#if p.implemented?.length}
								<div class="card p-5">
									<h3 class="flex items-center gap-2 text-sm font-semibold text-fg">
										<CircleCheck size={16} class="text-[var(--s-completed)]" aria-hidden="true" /> Implemented
									</h3>
									<ul class="mt-3 space-y-2 text-sm leading-relaxed text-muted">
										{#each p.implemented as f (f)}<li>{f}</li>{/each}
									</ul>
								</div>
							{/if}
							{#if p.planned?.length}
								<div class="card border-dashed p-5">
									<h3 class="flex items-center gap-2 text-sm font-semibold text-fg">
										<CircleDashed size={16} class="text-accent-2" aria-hidden="true" /> Planned / envisioned
									</h3>
									<ul class="mt-3 space-y-2 text-sm leading-relaxed text-muted">
										{#each p.planned as f (f)}<li>{f}</li>{/each}
									</ul>
								</div>
							{/if}
						</div>
					</section>
				{/if}

				{#if p.goals?.length}
					<section aria-labelledby="goals">
						<h2 id="goals" class="h2">Learning goals</h2>
						<p class="body">
							This is a learning project. These are its goals; completed results will be added as they are finished.
						</p>
						<ul class="mt-4 flex flex-wrap gap-2">
							{#each p.goals as g (g)}<li class="chip chip-learning">{g}</li>{/each}
						</ul>
					</section>
				{/if}

				{#if cs}
					<section aria-labelledby="challenges">
						<h2 id="challenges" class="h2">Challenges</h2>
						<ul class="list">
							{#each cs.challenges as c (c)}<li>{c}</li>{/each}
						</ul>
					</section>
					<section aria-labelledby="status">
						<h2 id="status" class="h2">Results &amp; current status</h2>
						<p class="body">{cs.status}</p>
					</section>
					<section aria-labelledby="learned">
						<h2 id="learned" class="h2">What I learned</h2>
						<ul class="list">
							{#each cs.learned as l (l)}<li>{l}</li>{/each}
						</ul>
					</section>
					<section aria-labelledby="next">
						<h2 id="next" class="h2">Next steps</h2>
						<ul class="list">
							{#each cs.next as n (n)}<li>{n}</li>{/each}
						</ul>
					</section>
				{/if}

				{#if p.gallery?.length}
					<section aria-labelledby="gallery">
						<h2 id="gallery" class="h2">Screenshots</h2>
						<div class="mt-5 grid gap-5 sm:grid-cols-2">
							{#each p.gallery as img (img.base)}
								<figure class="overflow-hidden rounded-2xl border border-line bg-surface" use:reveal>
									<Picture
										base={img.base}
										alt={img.alt}
										widths={[640, 1100]}
										width={1100}
										height={720}
										sizes="(min-width: 1024px) 400px, 100vw"
										class="aspect-[16/10] w-full object-cover"
									/>
									<figcaption class="px-4 py-3 text-sm text-muted">{img.caption}</figcaption>
								</figure>
							{/each}
						</div>
					</section>
				{/if}
			</div>

			<aside class="lg:sticky lg:top-24 lg:self-start" aria-label="Project facts">
				<dl class="card divide-y divide-line">
					<div class="p-5">
						<dt class="fact-label">Status</dt>
						<dd class="mt-2"><StatusBadge status={p.status} /></dd>
					</div>
					<div class="p-5">
						<dt class="fact-label">Context</dt>
						<dd class="mt-1 text-sm text-fg">{p.context}</dd>
					</div>
					<div class="p-5">
						<dt class="fact-label">Categories</dt>
						<dd class="mt-1 text-sm text-fg">{p.categories.map((c) => categoryLabels[c]).join(' · ')}</dd>
					</div>
					<div class="p-5">
						<dt class="fact-label">Technology</dt>
						<dd class="mt-2 flex flex-wrap gap-1.5">
							{#each p.tech as t (t)}<span class="tag">{t}</span>{/each}
						</dd>
					</div>
					<div class="p-5">
						<dt class="fact-label">Code</dt>
						<dd class="mt-1 text-sm">
							{#if p.repo}
								<a href={p.repo} target="_blank" rel="noopener" class="break-all text-accent hover:underline">
									{p.repo.replace('https://', '')}
								</a>
							{:else}
								<span class="text-muted">Not public</span>
							{/if}
						</dd>
					</div>
				</dl>
			</aside>
		</div>

		<nav class="mt-20 grid gap-4 border-t border-line pt-8 sm:grid-cols-2" aria-label="More projects">
			{#if data.prev}
				<a href="/projects/{data.prev.slug}/" class="pager">
					<span class="inline-flex items-center gap-1.5 text-xs text-subtle">
						<ArrowLeft size={14} aria-hidden="true" /> Previous
					</span>
					<span class="mt-1 block font-medium text-fg">{data.prev.title}</span>
				</a>
			{:else}<span></span>{/if}
			{#if data.next}
				<a href="/projects/{data.next.slug}/" class="pager sm:text-right">
					<span class="inline-flex items-center gap-1.5 text-xs text-subtle">
						Next <ArrowRight size={14} aria-hidden="true" />
					</span>
					<span class="mt-1 block font-medium text-fg">{data.next.title}</span>
				</a>
			{/if}
		</nav>
	</div>
</article>

<style>
	.glow {
		position: absolute;
		inset: -4rem 0 auto;
		height: 28rem;
		z-index: -1;
		background: radial-gradient(50% 60% at 70% 0%, var(--glow-1), transparent 70%);
		opacity: 0.6;
		pointer-events: none;
	}
	.cover {
		aspect-ratio: 16 / 8;
		overflow: hidden;
		border-radius: 1.5rem;
		border: 1px solid var(--line);
		background: var(--bg-2);
		box-shadow: var(--shadow);
	}
	@media (max-width: 639px) {
		.cover {
			aspect-ratio: 16 / 10;
		}
	}
	.h2 {
		font-size: 1.375rem;
		font-weight: 600;
		letter-spacing: -0.02em;
		color: var(--fg);
	}
	.body {
		margin-top: 0.75rem;
		line-height: 1.75;
		color: var(--muted);
	}
	.list {
		margin-top: 1rem;
		display: grid;
		gap: 0.6rem;
	}
	.list li {
		position: relative;
		padding-left: 1.25rem;
		line-height: 1.65;
		color: var(--muted);
	}
	.list li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.65rem;
		width: 0.4rem;
		height: 0.4rem;
		border-radius: 999px;
		background: var(--accent-2);
	}
	.flow {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.6rem;
	}
	.node {
		padding: 0.55rem 0.85rem;
		border-radius: 0.7rem;
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		color: var(--fg);
		background: var(--surface);
		border: 1px solid var(--line-strong);
	}
	.arrow {
		color: var(--accent-2);
		font-family: var(--font-mono);
	}
	.fact-label {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--subtle);
	}
	.pager {
		display: block;
		padding: 1.1rem 1.25rem;
		border-radius: 1rem;
		border: 1px solid var(--line);
		background: var(--surface);
		transition: border-color 150ms ease;
	}
	.pager:hover {
		border-color: var(--accent);
	}
</style>
