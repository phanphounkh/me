<script lang="ts">
	import Brain from '@lucide/svelte/icons/brain';
	import ChartColumn from '@lucide/svelte/icons/chart-column';
	import Code from '@lucide/svelte/icons/code';
	import LayoutPanelTop from '@lucide/svelte/icons/layout-panel-top';
	import ScanLine from '@lucide/svelte/icons/scan-line';
	import Server from '@lucide/svelte/icons/server';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import Terminal from '@lucide/svelte/icons/terminal';
	import { reveal } from '#lib/actions/reveal.ts';
	import SectionHeading from '#lib/components/ui/SectionHeading.svelte';
	import { currentlyLearning, skillGroups } from '#lib/content/skills.ts';

	const icons = {
		brain: Brain,
		scan: ScanLine,
		code: Code,
		chart: ChartColumn,
		server: Server,
		layout: LayoutPanelTop,
		terminal: Terminal
	};
</script>

<section id="skills" class="section" aria-labelledby="skills-title">
	<div class="container-x">
		<SectionHeading
			id="skills"
			index="05"
			eyebrow="Skills"
			title="Grouped by domain, backed by where I used them."
			intro="No percentage bars. Each group lists where the skills were actually applied, so you can judge depth from the evidence."
		/>

		<ul class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
			{#each skillGroups as group, i (group.title)}
				{@const Icon = icons[group.icon as keyof typeof icons] ?? Code}
				<li class="skill card flex flex-col p-6" use:reveal={(i % 3) * 70}>
					<div class="flex items-center gap-3">
						<span class="grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-accent" aria-hidden="true">
							<Icon size={19} />
						</span>
						<h3 class="font-semibold tracking-tight text-fg">{group.title}</h3>
					</div>
					<ul class="mt-5 flex flex-wrap gap-2" aria-label="{group.title} skills">
						{#each group.skills as s (s)}<li class="chip text-fg">{s}</li>{/each}
					</ul>
					<p class="mt-auto pt-5 text-xs leading-relaxed text-subtle">
						<span class="font-mono tracking-wide text-muted uppercase">Used in</span> — {group.evidence}
					</p>
				</li>
			{/each}

			<li class="card learning flex flex-col p-6" use:reveal={140}>
				<div class="flex items-center gap-3">
					<span
						class="grid h-10 w-10 place-items-center rounded-xl border border-dashed border-accent-2 text-accent-2"
						aria-hidden="true"
					>
						<Sparkles size={18} />
					</span>
					<h3 class="font-semibold tracking-tight text-fg">Currently learning</h3>
				</div>
				<ul class="mt-5 flex flex-wrap gap-2" aria-label="Currently learning">
					{#each currentlyLearning as s (s)}<li class="chip chip-learning">{s}</li>{/each}
				</ul>
				<p class="mt-auto pt-5 text-xs leading-relaxed text-subtle">
					Dashed outline = studying now, not yet applied in a finished project.
				</p>
			</li>
		</ul>
	</div>
</section>

<style>
	.skill {
		transition:
			border-color 200ms ease,
			transform 300ms var(--ease-out-soft);
	}
	.skill:hover {
		border-color: var(--line-strong);
		transform: translateY(-2px);
	}
	.learning {
		background: linear-gradient(160deg, var(--accent-2-soft), transparent 60%), var(--surface);
		border-style: dashed;
		border-color: color-mix(in srgb, var(--accent-2) 40%, var(--line));
	}
</style>
