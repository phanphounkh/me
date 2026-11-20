<script lang="ts">
	import GraduationCap from '@lucide/svelte/icons/graduation-cap';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import { reveal } from '#lib/actions/reveal.ts';
	import SectionHeading from '#lib/components/ui/SectionHeading.svelte';
	import { education, journey } from '#lib/content/experience.ts';

	const currentIndex = journey.findIndex((m) => m.state === 'current');
	// Fraction of the track that is "travelled" (up to the current step).
	const progress = currentIndex <= 0 ? 0 : currentIndex / (journey.length - 1);
</script>

<section id="journey" class="section bg-bg-2" aria-labelledby="journey-title">
	<div class="container-x">
		<SectionHeading
			id="journey"
			index="02"
			eyebrow="My journey"
			title="A steady path from building websites to building AI."
			intro="Education first, then real projects, then a deliberate move into machine learning and computer vision."
		/>

		<ol class="track mt-14" style="--progress: {progress}" use:reveal>
			{#each journey as step, i (step.title)}
				<li class="step" data-state={step.state} style="--i: {i}">
					<span class="node" aria-hidden="true"></span>
					<p class="font-mono text-xs tracking-wide text-accent-2">{step.period}</p>
					<h3 class="mt-2 text-base font-semibold text-fg">{step.title}</h3>
					<p class="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
					{#if step.state === 'current'}
						<span
							class="mt-3 inline-block rounded-full bg-accent-soft px-2.5 py-0.5 font-mono text-[0.6875rem] tracking-wide text-accent uppercase"
						>
							Now
						</span>
					{:else if step.state === 'planned'}
						<span
							class="mt-3 inline-block rounded-full border border-dashed border-line-strong px-2.5 py-0.5 font-mono text-[0.6875rem] tracking-wide text-subtle uppercase"
						>
							Next
						</span>
					{/if}
				</li>
			{/each}
		</ol>

		<div class="mt-16 grid gap-5 md:grid-cols-2">
			{#each education as edu, i (edu.school)}
				<article class="card flex gap-4 p-6" use:reveal={i * 80}>
					<span
						class="grid h-11 w-11 flex-none place-items-center rounded-xl bg-accent-soft text-accent"
						aria-hidden="true"
					>
						<GraduationCap size={20} />
					</span>
					<div>
						<h3 class="font-semibold text-fg">{edu.school}</h3>
						{#if edu.program || edu.detail}
							<p class="mt-0.5 text-sm text-fg">
								{[edu.program, edu.detail].filter(Boolean).join(' · ')}
							</p>
						{/if}
						<p class="mt-1 inline-flex items-center gap-1.5 text-sm text-subtle">
							<MapPin size={14} aria-hidden="true" />{edu.location}{#if edu.period}&nbsp;· {edu.period}{/if}
						</p>
						{#if edu.highlights.length}
							<ul class="mt-3 space-y-1.5 text-sm leading-relaxed text-muted">
								{#each edu.highlights as h (h)}<li>{h}</li>{/each}
							</ul>
						{/if}
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	/* Vertical on small screens, horizontal from lg. The gradient line fills up to "now". */
	.track {
		position: relative;
		display: grid;
		gap: 2rem;
		padding-left: 2rem;
	}
	.track::before,
	.track::after {
		content: '';
		position: absolute;
		left: 0.4375rem;
		top: 0.5rem;
		width: 2px;
		border-radius: 2px;
	}
	.track::before {
		bottom: 0.5rem;
		background: var(--line-strong);
	}
	.track::after {
		height: calc((100% - 1rem) * var(--progress));
		background: linear-gradient(180deg, var(--accent), var(--accent-2));
		transform-origin: top;
		transform: scaleY(0);
		transition: transform 1.4s var(--ease-out-soft) 0.2s;
	}
	:global(.is-revealed).track::after,
	:global(html:not(.js)) .track::after {
		transform: scaleY(1);
	}
	.step {
		position: relative;
	}
	.node {
		position: absolute;
		left: -2rem;
		top: 0.15rem;
		width: 1rem;
		height: 1rem;
		border-radius: 999px;
		background: var(--bg-2);
		border: 2px solid var(--accent);
	}
	.step[data-state='current'] .node {
		background: var(--accent-2);
		border-color: var(--accent-2);
		box-shadow: 0 0 0 6px var(--accent-2-soft);
	}
	.step[data-state='planned'] .node {
		border-style: dashed;
		border-color: var(--line-strong);
	}

	@media (min-width: 1024px) {
		.track {
			grid-template-columns: repeat(5, minmax(0, 1fr));
			gap: 1.75rem;
			padding-left: 0;
			padding-top: 2.25rem;
		}
		.track::before,
		.track::after {
			left: 0.5rem;
			top: 0.4375rem;
			height: 2px;
			width: auto;
		}
		.track::before {
			right: 0.5rem;
			bottom: auto;
		}
		.track::after {
			width: calc((100% - 1rem) * var(--progress));
			height: 2px;
			background: linear-gradient(90deg, var(--accent), var(--accent-2));
			transform-origin: left;
			transform: scaleX(0);
		}
		:global(.is-revealed).track::after,
		:global(html:not(.js)) .track::after {
			transform: scaleX(1);
		}
		.node {
			left: 0;
			top: -2.25rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.track::after {
			transform: none !important;
		}
	}
</style>
