<script lang="ts">
	import { reveal } from '#lib/actions/reveal.ts';
	import { pipeline } from '#lib/content/research.ts';

	let selected = $state(0);
	const stage = $derived(pipeline[selected]!);
	const buttons: HTMLButtonElement[] = [];

	function onKeydown(event: KeyboardEvent) {
		const last = pipeline.length - 1;
		let next: number | null = null;
		if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = selected === last ? 0 : selected + 1;
		if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = selected === 0 ? last : selected - 1;
		if (event.key === 'Home') next = 0;
		if (event.key === 'End') next = last;
		if (next === null) return;
		event.preventDefault();
		selected = next;
		buttons[next]?.focus();
	}
</script>

<div class="card overflow-hidden" use:reveal>
	<div class="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
		<h3 class="font-semibold text-fg">The Khmer OCR pipeline, step by step</h3>
		<p class="flex items-center gap-4 font-mono text-[0.6875rem] tracking-wide text-subtle uppercase">
			<span class="inline-flex items-center gap-1.5"><span class="h-2 w-2 rounded-full bg-accent"></span>Hands-on</span>
			<span class="inline-flex items-center gap-1.5">
				<span class="h-2 w-2 rounded-full border border-dashed border-accent-2"></span>Researching
			</span>
		</p>
	</div>

	<div class="steps" role="tablist" aria-label="OCR pipeline stages">
		{#each pipeline as s, i (s.id)}
			<button
				bind:this={buttons[i]}
				type="button"
				role="tab"
				id="stage-{s.id}"
				aria-selected={selected === i}
				aria-controls="stage-panel"
				tabindex={selected === i ? 0 : -1}
				class="step"
				data-mode={s.mode}
				onclick={() => (selected = i)}
				onkeydown={onKeydown}
			>
				<span class="num">{s.step}</span>
				<span class="text-sm font-medium text-fg">{s.title}</span>
				<span class="hidden text-xs text-muted sm:block">{s.short}</span>
			</button>
		{/each}
	</div>

	<div id="stage-panel" role="tabpanel" aria-labelledby="stage-{stage.id}" tabindex="0" class="p-5 sm:p-7">
		{#key stage.id}
			<div class="panel grid gap-6 md:grid-cols-[1fr_auto]">
				<div>
					<p class="font-mono text-xs tracking-wide text-accent-2">{stage.step} · {stage.short}</p>
					<h4 class="mt-1 text-xl font-semibold text-fg">{stage.title}</h4>
					<p class="mt-3 max-w-2xl leading-relaxed text-muted">{stage.detail}</p>
					<ul class="mt-4 flex flex-wrap gap-2" aria-label="Techniques">
						{#each stage.techniques as t (t)}<li class="tag">{t}</li>{/each}
					</ul>
				</div>
				<p class="self-start">
					{#if stage.mode === 'hands-on'}
						<span class="rounded-full bg-accent-soft px-3 py-1 font-mono text-xs text-accent">Hands-on</span>
					{:else}
						<span class="rounded-full border border-dashed border-accent-2 px-3 py-1 font-mono text-xs text-accent-2">
							Researching
						</span>
					{/if}
				</p>
			</div>
		{/key}
	</div>
</div>

<style>
	.steps {
		display: grid;
		grid-template-columns: repeat(6, minmax(7.5rem, 1fr));
		overflow-x: auto;
		scrollbar-width: thin;
		border-bottom: 1px solid var(--line);
	}
	.step {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.15rem;
		padding: 1rem 1rem 1.1rem;
		text-align: left;
		border-right: 1px solid var(--line);
		transition: background-color 150ms ease;
	}
	.step:last-child {
		border-right: 0;
	}
	.step:hover {
		background: var(--surface-hover);
	}
	.step::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 2px;
		background: linear-gradient(90deg, var(--accent), var(--accent-2));
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 300ms var(--ease-out-soft);
	}
	.step[aria-selected='true'] {
		background: var(--accent-soft);
	}
	.step[aria-selected='true']::after {
		transform: scaleX(1);
	}
	.num {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		color: var(--subtle);
	}
	.step[data-mode='hands-on'] .num::before,
	.step[data-mode='researching'] .num::before {
		content: '';
		display: inline-block;
		width: 0.45rem;
		height: 0.45rem;
		margin-right: 0.4rem;
		border-radius: 999px;
		vertical-align: 0.05rem;
	}
	.step[data-mode='hands-on'] .num::before {
		background: var(--accent);
	}
	.step[data-mode='researching'] .num::before {
		border: 1px dashed var(--accent-2);
	}
	.panel {
		animation: panel-in 360ms var(--ease-out-soft) both;
	}
	@keyframes panel-in {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
	}
</style>
