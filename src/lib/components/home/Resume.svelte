<script lang="ts">
	import Download from '@lucide/svelte/icons/download';
	import FileText from '@lucide/svelte/icons/file-text';
	import Printer from '@lucide/svelte/icons/printer';
	import { reveal } from '#lib/actions/reveal.ts';
	import Picture from '#lib/components/ui/Picture.svelte';
	import SectionHeading from '#lib/components/ui/SectionHeading.svelte';
	import { CV_PDF_PATH, profile } from '#lib/content/profile.ts';

	const facts = ['A4 · 2 pages', 'Text-selectable PDF', 'ATS-friendly single column', 'Portrait on page one'];
</script>

<section id="resume" class="section" aria-labelledby="resume-title">
	<div class="container-x">
		<div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
			<div>
				<SectionHeading
					id="resume"
					index="07"
					eyebrow="Resume"
					title="A recruiter-ready CV, generated from the same content."
					intro="The PDF is built from this site's content source, so the CV and the portfolio never disagree."
				/>
				<ul class="mt-8 grid max-w-md grid-cols-2 gap-3" use:reveal>
					{#each facts as f (f)}
						<li class="flex items-center gap-2 text-sm text-muted">
							<span class="h-1.5 w-1.5 rounded-full bg-accent-2" aria-hidden="true"></span>{f}
						</li>
					{/each}
				</ul>
				<div class="mt-8 flex flex-wrap gap-3" use:reveal={80}>
					<a href={CV_PDF_PATH} class="btn btn-primary" download>
						<Download size={17} aria-hidden="true" /> Download CV (PDF)
					</a>
					<a href="/cv/" class="btn btn-secondary">
						<Printer size={17} aria-hidden="true" /> Printable version
					</a>
				</div>
			</div>

			<a href="/cv/" class="preview group" use:reveal={120}>
				<div class="sheet">
					<!-- Decorative inside the link: the visible "Open printable CV" label names it. -->
					<Picture
						base="cv-preview"
						alt=""
						widths={[480, 760]}
						width={760}
						height={1075}
						sizes="(min-width: 1024px) 420px, 80vw"
						class="h-full w-full object-cover object-top"
					/>
				</div>
				<span class="open-hint"><FileText size={15} aria-hidden="true" /> Open printable CV</span>
			</a>
		</div>
	</div>
</section>

<style>
	.preview {
		position: relative;
		display: block;
		width: min(100%, 26rem);
		margin-inline: auto;
		perspective: 1600px;
		border-radius: 1rem;
	}
	.sheet {
		aspect-ratio: 210 / 297;
		overflow: hidden;
		border-radius: 0.75rem;
		border: 1px solid var(--line-strong);
		background: #fff;
		box-shadow:
			0 40px 80px -40px rgb(0 0 0 / 0.6),
			0 0 0 8px var(--surface),
			0 0 0 9px var(--line);
		transform: rotateX(6deg) rotateY(-10deg) rotateZ(1deg);
		transition: transform 600ms var(--ease-out-soft);
	}
	.preview:hover .sheet,
	.preview:focus-visible .sheet {
		transform: none;
	}
	.open-hint {
		position: absolute;
		left: 50%;
		bottom: 1.25rem;
		transform: translateX(-50%);
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.45rem 0.9rem;
		border-radius: 999px;
		font-size: 0.8125rem;
		color: #fff;
		background: rgb(6 9 18 / 0.82);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		white-space: nowrap;
	}
	@media (prefers-reduced-motion: reduce) {
		.sheet {
			transform: none;
		}
	}
</style>
