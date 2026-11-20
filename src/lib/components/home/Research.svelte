<script lang="ts">
	import BookOpen from '@lucide/svelte/icons/book-open';
	import ShieldCheck from '@lucide/svelte/icons/shield-check';
	import { reveal } from '#lib/actions/reveal.ts';
	import LineFigure from '#lib/components/research/LineFigure.svelte';
	import PipelineExplorer from '#lib/components/research/PipelineExplorer.svelte';
	import SectionHeading from '#lib/components/ui/SectionHeading.svelte';
	import { khmerChallenges, learningNow, principles } from '#lib/content/research.ts';
</script>

<section id="research" class="section bg-bg-2" aria-labelledby="research-title">
	<div class="container-x">
		<SectionHeading
			id="research"
			index="06"
			eyebrow="Research & learning"
			title="Khmer OCR is where my AI work is focused."
			intro="Turning images of Khmer documents into text means solving data, vision and evaluation problems together. Here is how I approach it — and what I am still learning."
		/>

		<div class="mt-12 grid items-start gap-6 lg:grid-cols-[1.1fr_0.9fr]">
			<LineFigure />

			<div>
				<h3 class="text-lg font-semibold text-fg" use:reveal>Why Khmer is hard for OCR</h3>
				<ul class="mt-4 grid gap-4 sm:grid-cols-2">
					{#each khmerChallenges as c, i (c.title)}
						<li class="card p-5" use:reveal={i * 70}>
							<p lang="km" class="khmer text-lg text-accent-2">{c.example}</p>
							<h4 class="mt-2 font-medium text-fg">{c.title}</h4>
							<p class="mt-1 text-sm leading-relaxed text-muted">{c.body}</p>
						</li>
					{/each}
				</ul>
			</div>
		</div>

		<div class="mt-10">
			<PipelineExplorer />
		</div>

		<div class="mt-6 grid gap-6 md:grid-cols-2">
			<div class="card p-6" use:reveal>
				<h3 class="flex items-center gap-2.5 font-semibold text-fg">
					<ShieldCheck size={18} class="text-accent-2" aria-hidden="true" /> How I keep results honest
				</h3>
				<ul class="mt-4 space-y-3">
					{#each principles as p (p)}
						<li class="flex gap-3 text-sm leading-relaxed text-muted">
							<span class="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent-2" aria-hidden="true"></span>{p}
						</li>
					{/each}
				</ul>
			</div>
			<div class="card p-6" use:reveal={80}>
				<h3 class="flex items-center gap-2.5 font-semibold text-fg">
					<BookOpen size={18} class="text-accent" aria-hidden="true" /> Studying now
				</h3>
				<dl class="mt-4 space-y-3">
					{#each learningNow as l (l.topic)}
						<div>
							<dt class="text-sm font-medium text-fg">{l.topic}</dt>
							<dd class="text-sm leading-relaxed text-muted">{l.note}</dd>
						</div>
					{/each}
				</dl>
			</div>
		</div>
	</div>
</section>
