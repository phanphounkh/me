<script lang="ts">
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import Download from '@lucide/svelte/icons/download';
	import Printer from '@lucide/svelte/icons/printer';
	import Seo from '#lib/components/Seo.svelte';
	import { education, internship } from '#lib/content/experience.ts';
	import { CV_PDF_PATH, SITE_URL, profile } from '#lib/content/profile.ts';
	import { getProject, moreAiWork } from '#lib/content/projects.ts';
	import { currentlyLearning, cvSkills } from '#lib/content/skills.ts';

	const strip = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

	// Selected projects for the CV, most relevant to AI/ML roles first.
	const p = (slug: string) => getProject(slug)!;
	const htr = moreAiWork.find((w) => w.title.startsWith('Khmer HTR'))!;
	const cvProjects = [
		{
			title: p('khmer-ocr-research').title,
			status: 'Research · SKAI internship',
			text: 'Researching OCR/HTR for printed, handwritten and historical Khmer documents: document collection, preprocessing, line segmentation, annotation workflows and CER/WER evaluation planning. Python, OpenCV, PyTorch.',
			link: null
		},
		{
			title: p('khmer-annotation-studio').title,
			status: 'Prototype · SKAI internship',
			text: 'Web tool to upload scanned pages, propose and correct line boxes (OpenCV), transcribe Khmer lines, review labels and export leakage-safe dataset splits. SvelteKit, FastAPI, PostgreSQL, Docker.',
			link: null
		},
		{
			title: htr.title,
			status: 'Research · personal',
			text: 'Reproducible pipeline for fine-tuning TrOCR on Khmer handwriting, with a synthetic handwriting generator and CER/WER metrics. No benchmark results published yet. PyTorch, Hugging Face Transformers.',
			link: htr.repo!
		},
		{
			title: p('phnom-penh-digital-world').title,
			status: 'In development · personal',
			text: 'Multiplayer 3D city built from OpenStreetMap data of Phnom Penh, with a marketplace, routed vehicles and simulated deliveries. SvelteKit, Three.js, FastAPI, PostgreSQL + PostGIS.',
			link: p('phnom-penh-digital-world').repo!
		},
		{
			title: p('bondarnh-erp').title,
			status: 'In development · personal',
			text: 'Khmer/English social-commerce marketplace grown from my Campus Eats canteen app: shops, a shopping feed, split checkout with sandbox KHQR or cash on delivery, messaging, reviews and refunds, seller analytics and an admin console. SvelteKit, FastAPI, PostgreSQL, Redis, Celery.',
			link: p('bondarnh-erp').repo!
		}
	];

	const contacts = $derived(
		[
			{ label: profile.location, href: null },
			{ label: profile.email, href: `mailto:${profile.email}` },
			{ label: strip(SITE_URL), href: SITE_URL },
			{ label: strip(profile.links.github), href: profile.links.github },
			{ label: strip(profile.links.githubWeb), href: profile.links.githubWeb },
			profile.links.linkedin ? { label: strip(profile.links.linkedin), href: profile.links.linkedin } : null
		].filter((c) => c !== null)
	);
</script>

<Seo
	title="CV — {profile.name}, AI/ML Engineer"
	description="Printable CV of {profile.name}: AI/ML Engineering Intern at SKAI Technology, computer vision and Khmer OCR, Python developer."
	path="/cv/"
	type="profile"
/>

<div class="toolbar" role="toolbar" aria-label="CV actions">
	<a href="/" class="tb-btn"><ArrowLeft size={16} aria-hidden="true" /> Back to portfolio</a>
	<div class="flex gap-2">
		<button type="button" class="tb-btn" onclick={() => window.print()}>
			<Printer size={16} aria-hidden="true" /> Print
		</button>
		<a href={CV_PDF_PATH} class="tb-btn tb-primary" download><Download size={16} aria-hidden="true" /> Download PDF</a>
	</div>
</div>

<main class="cv-wrap">
	<article class="sheet" aria-label="Curriculum vitae of {profile.name}">
		<header class="cv-head">
			<img src="/images/cv-portrait-420.jpg" alt="Portrait of {profile.name}" width="420" height="420" class="photo" />
			<div class="min-w-0">
				<h1 class="name">{profile.name.toUpperCase()}</h1>
				<p class="title">{profile.title}</p>
				<ul class="contacts">
					{#each contacts as c (c.label)}
						<li>
							{#if c.href}<a href={c.href}>{c.label}</a>{:else}{c.label}{/if}
						</li>
					{/each}
				</ul>
			</div>
		</header>

		<section class="block">
			<h2>Summary</h2>
			<p>{profile.summary}</p>
		</section>

		<section class="block">
			<h2>Technical Skills</h2>
			<dl class="skills">
				{#each cvSkills as s (s.label)}
					<dt>{s.label}</dt>
					<dd>{s.value}</dd>
				{/each}
				<dt>Now learning</dt>
				<dd>{currentlyLearning.join(', ')}</dd>
			</dl>
		</section>

		<section class="block">
			<h2>Experience</h2>
			<div class="entry">
				<div class="entry-head">
					<h3>{internship.role} — {internship.company}</h3>
					<p class="when">{internship.start} – {internship.end} (expected completion {internship.expectedEnd})</p>
				</div>
				<p class="where">{internship.location}</p>
				<ul class="bullets">
					{#each internship.cvBullets as b (b)}<li>{b}</li>{/each}
				</ul>
			</div>
		</section>

		<section class="block">
			<h2>Education</h2>
			{#each education as edu (edu.school)}
				<div class="entry">
					<div class="entry-head">
						<h3>{edu.school}</h3>
						{#if edu.period}<p class="when">{edu.period}</p>{:else if edu.current}<p class="when">Current</p>{/if}
					</div>
					{#if edu.program || edu.detail}<p class="desc">
							{[edu.program, edu.detail].filter(Boolean).join(' — ')}
						</p>{/if}
					<p class="where">{edu.location}</p>
				</div>
			{/each}
		</section>

		<section class="block">
			<h2>Selected Projects</h2>
			{#each cvProjects as proj (proj.title)}
				<div class="entry">
					<div class="entry-head">
						<h3>{proj.title}</h3>
						<p class="when">{proj.status}</p>
					</div>
					<p class="desc">{proj.text}</p>
					{#if proj.link}<p class="link"><a href={proj.link}>{strip(proj.link)}</a></p>{/if}
				</div>
			{/each}
			<p class="more">More projects and case studies: <a href="{SITE_URL}/#projects">{strip(SITE_URL)}/#projects</a></p>
		</section>

		<section class="block two-col">
			<div>
				<h2>Languages</h2>
				<ul class="plain">
					{#each profile.languages as l (l.name)}<li><strong>{l.name}</strong> — {l.level}</li>{/each}
				</ul>
			</div>
			<div>
				<h2>Interests</h2>
				<p>
					Computer vision, OCR and handwritten text recognition, NLP and LLMs, data engineering, Python software
					development.
				</p>
			</div>
		</section>
	</article>
</main>

<style>
	:global(body:has(.cv-wrap)) {
		background: #dfe4ec;
	}
	:global([data-theme='dark'] body:has(.cv-wrap)) {
		background: #0b1020;
	}
	.toolbar {
		position: sticky;
		top: 0;
		z-index: 10;
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 1rem;
		background: color-mix(in srgb, var(--bg) 85%, transparent);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-bottom: 1px solid var(--line);
	}
	.tb-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		min-height: 2.5rem;
		padding: 0.45rem 0.9rem;
		border-radius: 0.65rem;
		font-size: 0.875rem;
		color: var(--fg);
		border: 1px solid var(--line-strong);
		background: var(--surface);
	}
	.tb-btn:hover {
		border-color: var(--accent);
	}
	.tb-primary {
		color: #fff;
		background: var(--btn-bg);
		border-color: var(--btn-bg);
	}

	.cv-wrap {
		padding: 2rem 1rem 4rem;
		overflow-x: auto;
	}

	/* ── The sheet: fixed print palette, independent of the site theme ── */
	.sheet {
		--ink: #0f172a;
		--ink-2: #334155;
		--ink-3: #475569;
		--rule: #cbd5e1;
		--accent-cv: #1d4ed8;
		box-sizing: border-box;
		width: 210mm;
		max-width: 100%;
		min-height: 297mm;
		margin: 0 auto;
		padding: 14mm 16mm;
		background: #fff;
		color: var(--ink);
		font-family: 'Geist Variable', 'Noto Sans Khmer Variable', Arial, sans-serif;
		font-size: 9.6pt;
		line-height: 1.45;
		box-shadow: 0 30px 60px -30px rgb(0 0 0 / 0.45);
		border-radius: 4px;
	}
	.sheet a {
		color: var(--accent-cv);
		text-decoration: none;
	}
	.cv-head {
		display: grid;
		grid-template-columns: 30mm 1fr;
		gap: 7mm;
		align-items: center;
		padding-bottom: 5mm;
		border-bottom: 1.5pt solid var(--ink);
	}
	.photo {
		width: 30mm;
		height: 30mm;
		object-fit: cover;
		border-radius: 3mm;
	}
	.name {
		font-size: 24pt;
		line-height: 1.05;
		font-weight: 700;
		letter-spacing: -0.02em;
		color: var(--ink);
	}
	.title {
		margin-top: 1.5mm;
		font-size: 11pt;
		font-weight: 500;
		color: var(--accent-cv);
	}
	.contacts {
		margin-top: 2.5mm;
		display: flex;
		flex-wrap: wrap;
		gap: 0.5mm 3.5mm;
		font-size: 8.6pt;
		color: var(--ink-2);
	}
	.contacts li + li::before {
		content: '·';
		margin-right: 3.5mm;
		color: var(--rule);
	}
	/* On screen, give the small CV links a comfortable 24px target (print is unaffected). */
	@media screen {
		.contacts a,
		.link a,
		.more a {
			display: inline-block;
			min-height: 24px;
			line-height: 24px;
		}
	}
	.block {
		margin-top: 5mm;
	}
	.block h2 {
		margin-bottom: 2mm;
		padding-bottom: 1mm;
		font-size: 9.5pt;
		font-weight: 700;
		/* No letter-spacing: tracked capitals extract as "S U M M A R Y" in ATS parsers. */
		letter-spacing: 0;
		text-transform: uppercase;
		color: var(--ink);
		border-bottom: 0.75pt solid var(--rule);
	}
	.block p {
		color: var(--ink-2);
	}
	.skills {
		display: grid;
		grid-template-columns: 30mm 1fr;
		gap: 1mm 4mm;
	}
	.skills dt {
		font-weight: 600;
		color: var(--ink);
	}
	.skills dd {
		color: var(--ink-2);
	}
	.entry + .entry {
		margin-top: 3mm;
	}
	.entry {
		break-inside: avoid;
	}
	.entry-head {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 0 4mm;
		align-items: baseline;
	}
	.entry h3 {
		font-size: 10pt;
		font-weight: 650;
		color: var(--ink);
	}
	.when {
		font-size: 8.6pt;
		color: var(--ink-3) !important;
	}
	.where {
		font-size: 8.6pt;
		color: var(--ink-3) !important;
	}
	.desc {
		margin-top: 0.5mm;
	}
	.link {
		font-size: 8.4pt;
	}
	.bullets {
		margin-top: 1.5mm;
		padding-left: 4mm;
		list-style: disc;
		color: var(--ink-2);
	}
	.bullets li + li {
		margin-top: 0.8mm;
	}
	.bullets li::marker {
		color: var(--ink-3);
	}
	.more {
		margin-top: 3mm;
		font-size: 8.6pt;
	}
	/* Links inside running text are underlined, not distinguished by colour alone. */
	.more a {
		text-decoration: underline;
		text-underline-offset: 2px;
	}
	.two-col {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 8mm;
	}
	.plain li + li {
		margin-top: 0.5mm;
	}
	.plain {
		color: var(--ink-2);
	}

	@media screen and (max-width: 820px) {
		.sheet {
			width: 100%;
			min-height: 0;
			padding: 8mm 6mm;
		}
		.cv-head {
			grid-template-columns: 22mm 1fr;
			gap: 4mm;
		}
		.photo {
			width: 22mm;
			height: 22mm;
		}
		.name {
			font-size: 19pt;
		}
		.skills {
			grid-template-columns: 1fr;
		}
		.skills dd {
			margin-bottom: 1.5mm;
		}
		.two-col {
			grid-template-columns: 1fr;
			gap: 0;
		}
	}

	@media print {
		@page {
			size: A4;
			margin: 14mm 16mm;
		}
		:global(html),
		:global(body) {
			background: #fff !important;
		}
		.toolbar {
			display: none;
		}
		.cv-wrap {
			padding: 0;
			overflow: visible;
		}
		.sheet {
			width: auto;
			min-height: 0;
			padding: 0;
			box-shadow: none;
			border-radius: 0;
		}
		.block h2 {
			break-after: avoid;
		}
	}
</style>
