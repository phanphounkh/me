<script lang="ts">
	import { reveal } from '#lib/actions/reveal.ts';

	// Sample sentences written for this illustration — not taken from any dataset.
	const lines = [
		{ km: 'ខ្ញុំទៅសាលារៀននៅព្រឹកនេះ។', en: 'I go to school this morning.' },
		{ km: 'ភាសាខ្មែរមានស្រៈច្រើន។', en: 'The Khmer language has many vowels.' },
		{ km: 'អក្សរខ្មែរគ្មានដកឃ្លារវាងពាក្យ។', en: 'Khmer script has no spaces between words.' }
	];
</script>

<figure class="figure card" use:reveal>
	<div class="paper">
		<div class="scanline" aria-hidden="true"></div>
		{#each lines as line, i (i)}
			<div class="line" style="--i: {i}">
				<span class="label" aria-hidden="true">line_{String(i + 1).padStart(2, '0')}</span>
				<p lang="km" class="khmer text-[1.05rem] text-fg sm:text-[1.2rem]" title={line.en}>{line.km}</p>
			</div>
		{/each}
	</div>
	<div class="crop">
		<p class="font-mono text-[0.6875rem] tracking-[0.12em] text-subtle uppercase">line_03 → transcription</p>
		<p lang="km" class="khmer mt-2 rounded-lg border border-line bg-surface px-3 py-2 text-fg">{lines[2]!.km}</p>
		<p class="mt-2 text-xs text-subtle">“{lines[2]!.en}”</p>
		<p class="mt-4 font-mono text-xs text-muted">
			CER = (substitutions + deletions + insertions) ÷ reference characters
		</p>
	</div>
	<figcaption class="px-5 pb-4 text-xs text-subtle sm:px-6">
		Illustration of line-level segmentation with sample sentences — not output from a real model or dataset.
	</figcaption>
</figure>

<style>
	.figure {
		overflow: hidden;
	}
	.paper {
		position: relative;
		margin: 1.25rem 1.25rem 0;
		padding: 2rem 1.25rem 1.5rem;
		border-radius: 0.9rem;
		background:
			repeating-linear-gradient(180deg, transparent 0 2.65rem, var(--line) 2.65rem calc(2.65rem + 1px)),
			var(--surface-strong);
		border: 1px solid var(--line);
		overflow: hidden;
	}
	.line {
		position: relative;
		display: block;
		width: fit-content;
		max-width: 100%;
		margin-bottom: 1.6rem;
		padding: 0.15rem 0.5rem;
	}
	.line::before {
		content: '';
		position: absolute;
		inset: -0.1rem -0.1rem;
		border: 1.5px solid var(--accent-2);
		border-radius: 0.35rem;
		background: var(--accent-2-soft);
		clip-path: inset(0 100% 0 0);
		transition: clip-path 900ms var(--ease-out-soft);
		transition-delay: calc(500ms + var(--i) * 350ms);
	}
	.label {
		position: absolute;
		top: -1.15rem;
		left: -0.1rem;
		padding: 0 0.35rem;
		border-radius: 0.25rem;
		font-family: var(--font-mono);
		font-size: 0.625rem;
		line-height: 1rem;
		color: var(--bg);
		background: var(--accent-2);
		opacity: 0;
		transition: opacity 400ms ease;
		transition-delay: calc(900ms + var(--i) * 350ms);
	}
	.line p {
		position: relative;
		line-height: 2;
	}
	:global(.is-revealed) .line::before,
	:global(html:not(.js)) .line::before {
		clip-path: inset(0 0 0 0);
	}
	:global(.is-revealed) .label,
	:global(html:not(.js)) .label {
		opacity: 1;
	}
	.scanline {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		height: 40%;
		background: linear-gradient(180deg, transparent, rgb(52 213 238 / 0.12) 90%, rgb(52 213 238 / 0.55));
		transform: translateY(-100%);
		pointer-events: none;
	}
	:global(.is-revealed) .scanline {
		animation: scan 2.2s cubic-bezier(0.45, 0, 0.2, 1) 0.2s 1 both;
	}
	@keyframes scan {
		to {
			transform: translateY(260%);
			opacity: 0;
		}
	}
	.crop {
		margin: 1rem 1.25rem 1rem;
		padding: 1rem;
		border-radius: 0.9rem;
		border: 1px dashed var(--line-strong);
	}
	@media (prefers-reduced-motion: reduce) {
		.line::before {
			clip-path: none;
		}
		.label {
			opacity: 1;
		}
		.scanline {
			display: none;
		}
	}
</style>
