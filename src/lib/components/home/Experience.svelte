<script lang="ts">
	import CalendarDays from '@lucide/svelte/icons/calendar-days';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import Info from '@lucide/svelte/icons/info';
	import { reveal } from '#lib/actions/reveal.ts';
	import SectionHeading from '#lib/components/ui/SectionHeading.svelte';
	import { internship, internshipTimeline, workAreas } from '#lib/content/experience.ts';

	let selected = $state(0);
	const tabs: HTMLButtonElement[] = [];
	const area = $derived(workAreas[selected]!);
	const handsOn = $derived(area.items.filter((i) => i.mode === 'hands-on'));
	const researching = $derived(area.items.filter((i) => i.mode === 'researching'));

	// Roving focus for the tab list (WAI-ARIA tabs pattern).
	function onTabKeydown(event: KeyboardEvent) {
		const last = workAreas.length - 1;
		let next: number | null = null;
		if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = selected === last ? 0 : selected + 1;
		if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = selected === 0 ? last : selected - 1;
		if (event.key === 'Home') next = 0;
		if (event.key === 'End') next = last;
		if (next === null) return;
		event.preventDefault();
		selected = next;
		tabs[next]?.focus();
	}
</script>

<section id="experience" class="section" aria-labelledby="experience-title">
	<div class="container-x">
		<SectionHeading
			id="experience"
			index="03"
			eyebrow="Experience"
			title="AI/ML Engineering Intern at SKAI Technology."
			intro={internship.summary}
		/>

		<div class="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
			<!-- Role card + timeline -->
			<article class="card p-6 sm:p-8" use:reveal>
				<div class="flex items-start gap-4">
					<span
						class="grid h-12 w-12 flex-none place-items-center rounded-xl border border-line-strong bg-surface-strong font-mono text-sm font-semibold text-fg"
						aria-hidden="true"
					>
						SK
					</span>
					<div class="min-w-0">
						<h3 class="text-lg font-semibold text-fg">{internship.role}</h3>
						<p class="text-sm text-muted">{internship.company}</p>
					</div>
					<span
						class="ml-auto rounded-full bg-accent-2-soft px-2.5 py-1 font-mono text-[0.6875rem] tracking-wide whitespace-nowrap text-accent-2 uppercase"
					>
						Ongoing
					</span>
				</div>
				<dl class="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
					<div class="inline-flex items-center gap-2">
						<dt><CalendarDays size={15} aria-hidden="true" /><span class="sr-only">Dates</span></dt>
						<dd>
							<time datetime={internship.startISO}>{internship.start}</time> –
							<time datetime={internship.endISO}>{internship.end}</time> (expected)
						</dd>
					</div>
					<div class="inline-flex items-center gap-2">
						<dt><MapPin size={15} aria-hidden="true" /><span class="sr-only">Location</span></dt>
						<dd>{internship.location}</dd>
					</div>
				</dl>

				<ol class="timeline mt-8">
					{#each internshipTimeline as m, i (m.period)}
						<li data-state={m.state} use:reveal={i * 90}>
							<span class="dot" aria-hidden="true"></span>
							<p class="font-mono text-xs tracking-wide text-accent-2">
								{m.period}
								{#if m.state === 'current'}<span class="ml-2 text-accent">· now</span>{/if}
								{#if m.state === 'planned'}<span class="ml-2 text-subtle">· planned</span>{/if}
							</p>
							<h4 class="mt-1 font-medium text-fg">{m.title}</h4>
							<p class="mt-1 text-sm leading-relaxed text-muted">{m.body}</p>
						</li>
					{/each}
				</ol>
			</article>

			<!-- Work areas -->
			<div class="card overflow-hidden" use:reveal={100}>
				<div class="border-b border-line px-4 pt-4 sm:px-6 sm:pt-6">
					<p class="text-sm font-medium text-fg">Primary work areas</p>
					<div class="tablist mt-3" role="tablist" aria-label="Internship work areas">
						{#each workAreas as wa, i (wa.id)}
							<button
								bind:this={tabs[i]}
								type="button"
								role="tab"
								id="tab-{wa.id}"
								aria-selected={selected === i}
								aria-controls="panel-{wa.id}"
								tabindex={selected === i ? 0 : -1}
								class="tab"
								onclick={() => (selected = i)}
								onkeydown={onTabKeydown}
							>
								<span class="font-mono text-[0.6875rem] text-subtle">{String.fromCharCode(65 + i)}</span>
								{wa.title}
							</button>
						{/each}
					</div>
				</div>

				<div class="p-5 sm:p-7" role="tabpanel" id="panel-{area.id}" aria-labelledby="tab-{area.id}" tabindex="0">
					{#key area.id}
						<div class="panel-in">
							<h3 class="text-xl font-semibold text-fg">{area.title}</h3>
							<p class="mt-2 text-sm leading-relaxed text-muted">{area.summary}</p>

							<div class="mt-6 grid gap-6 sm:grid-cols-2">
								{#if handsOn.length}
									<div>
										<h4 class="legend"><span class="sw sw-solid" aria-hidden="true"></span>Hands-on</h4>
										<ul class="mt-3 space-y-2">
											{#each handsOn as item (item.text)}
												<li class="item">{item.text}</li>
											{/each}
										</ul>
									</div>
								{/if}
								{#if researching.length}
									<div>
										<h4 class="legend">
											<span class="sw sw-dashed" aria-hidden="true"></span>Researching &amp; studying
										</h4>
										<ul class="mt-3 space-y-2">
											{#each researching as item (item.text)}
												<li class="item item-research">{item.text}</li>
											{/each}
										</ul>
									</div>
								{/if}
							</div>

							{#if area.note}
								<p
									class="mt-6 flex gap-2.5 rounded-xl border border-line bg-surface px-4 py-3 text-sm leading-relaxed text-muted"
								>
									<Info size={16} class="mt-0.5 flex-none text-accent-2" aria-hidden="true" />{area.note}
								</p>
							{/if}
						</div>
					{/key}
				</div>
			</div>
		</div>

		<p class="mt-6 text-sm text-subtle" use:reveal>
			Confidentiality: internal SKAI Technology code, datasets, architecture and results are not shown on this site.
		</p>
	</div>
</section>

<style>
	.timeline {
		position: relative;
		display: grid;
		gap: 1.5rem;
		padding-left: 1.75rem;
	}
	.timeline::before {
		content: '';
		position: absolute;
		left: 0.3125rem;
		top: 0.4rem;
		bottom: 0.4rem;
		width: 1.5px;
		background: linear-gradient(180deg, var(--accent), var(--accent-2) 70%, var(--line-strong));
	}
	.timeline li {
		position: relative;
	}
	.dot {
		position: absolute;
		left: -1.75rem;
		top: 0.2rem;
		width: 0.75rem;
		height: 0.75rem;
		border-radius: 999px;
		background: var(--surface-strong);
		border: 2px solid var(--accent);
	}
	[data-state='current'] .dot {
		background: var(--accent-2);
		border-color: var(--accent-2);
		box-shadow: 0 0 0 5px var(--accent-2-soft);
	}
	/* Pulse ring animated with transform/opacity only (composited, no repaint per frame). */
	[data-state='current'] .dot::after {
		content: '';
		position: absolute;
		inset: -2px;
		border-radius: inherit;
		border: 2px solid var(--accent-2);
		animation: ring 2.6s ease-out infinite;
	}
	[data-state='planned'] .dot {
		border-style: dashed;
		border-color: var(--subtle);
	}
	@keyframes ring {
		from {
			transform: scale(1);
			opacity: 0.7;
		}
		to {
			transform: scale(2.4);
			opacity: 0;
		}
	}

	/* Wrapping pills: every area stays visible at any width (no hidden horizontal scroll). */
	.tablist {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		padding-bottom: 1rem;
	}
	.tab {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		min-height: 2.25rem;
		padding: 0.35rem 0.75rem;
		border-radius: 999px;
		font-size: 0.8125rem;
		text-align: left;
		color: var(--muted);
		border: 1px solid var(--line);
		background: transparent;
		transition:
			color 150ms ease,
			border-color 150ms ease,
			background-color 150ms ease;
	}
	.tab:hover {
		color: var(--fg);
		border-color: var(--line-strong);
	}
	.tab[aria-selected='true'] {
		color: var(--fg);
		border-color: color-mix(in srgb, var(--accent-2) 55%, transparent);
		background: var(--accent-2-soft);
	}
	.legend {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--subtle);
	}
	.sw {
		width: 0.75rem;
		height: 0.75rem;
		border-radius: 0.2rem;
	}
	.sw-solid {
		background: var(--accent);
	}
	.sw-dashed {
		border: 1.5px dashed var(--accent-2);
	}
	.item {
		position: relative;
		padding: 0.55rem 0.75rem 0.55rem 0.9rem;
		font-size: 0.875rem;
		line-height: 1.35;
		color: var(--fg);
		border-radius: 0.6rem;
		background: var(--surface);
		border: 1px solid var(--line);
		border-left: 2px solid var(--accent);
	}
	.item-research {
		color: var(--muted);
		background: transparent;
		border-style: dashed;
		border-left: 2px dashed var(--accent-2);
	}
	.panel-in {
		animation: panel-in 380ms var(--ease-out-soft) both;
	}
	@keyframes panel-in {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
	}
</style>
