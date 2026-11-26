/**
 * The chatbot's knowledge base, built from the same content files as the site and the CV
 * (src/lib/content/*.ts). Editing the content updates the assistant — there is nothing to re-index.
 *
 * Each chunk is one self-contained topic, small enough to retrieve on its own, with a link to
 * where the same information appears on the site (shown to visitors as a source).
 */
import { education, internship, internshipTimeline, journey, workAreas } from '#lib/content/experience.ts';
import { CV_PDF_PATH, SITE_URL, profile } from '#lib/content/profile.ts';
import { demoUrl, earlierWork, moreAiWork, projects } from '#lib/content/projects.ts';
import { khmerChallenges, learningNow, pipeline, principles } from '#lib/content/research.ts';
import { currentlyLearning, heroSkills, skillGroups } from '#lib/content/skills.ts';
import type { CompactProject } from '#lib/content/types.ts';

export interface Chunk {
	id: string;
	title: string;
	/** Site link for the same information (a section anchor, case study or file). */
	href: string;
	text: string;
}

const bullets = (items: readonly string[]) => items.map((i) => `- ${i}`).join('\n');
const lines = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join('\n');

function compact(p: CompactProject, group: string): Chunk {
	return {
		id: `work:${p.title}`,
		title: p.title,
		href: '/#projects',
		text: lines(
			`${group}: ${p.title} (${p.status}). Context: ${p.context}.`,
			p.summary,
			`Tech: ${p.tech.join(', ')}.`,
			p.repo && `Code: ${p.repo}`,
			p.live && `Live demo: ${p.live}`,
			p.demo && `Demo video: ${demoUrl(p.demo)}`
		)
	};
}

function build(): Chunk[] {
	const chunks: Chunk[] = [];
	const add = (c: Chunk) => chunks.push(c);

	// ── Profile ────────────────────────────────────────────────────────────
	add({
		id: 'profile',
		title: 'Who Phoun is',
		href: '/#about',
		text: lines(
			`${profile.name} — ${profile.title}. Currently ${profile.currentRole} at ${profile.company}, based in ${profile.location}.`,
			profile.summary,
			`Availability: ${profile.availability}.`
		)
	});
	add({
		id: 'contact',
		title: 'Contact details',
		href: '/#contact',
		text: lines(
			`How to contact ${profile.name}:`,
			`- Email: ${profile.email} (the fastest way to reach him)`,
			`- Phone / call: ${profile.phone.display}`,
			`- Location: ${profile.location} (UTC+7)`,
			`- GitHub (AI/ML work): ${profile.links.github}`,
			`- GitHub (web projects): ${profile.links.githubWeb}`,
			profile.links.linkedin && `- LinkedIn: ${profile.links.linkedin}`,
			profile.links.youtube && `- YouTube: ${profile.links.youtube}`,
			`- CV (PDF): ${SITE_URL}${CV_PDF_PATH}`
		)
	});
	add({
		id: 'about',
		title: 'Background and goals',
		href: '/#about',
		text: profile.about.join('\n\n')
	});
	add({
		id: 'interests',
		title: 'Interests, target roles and languages',
		href: '/#about',
		text: lines(
			`Interests: ${profile.interests.join(', ')}.`,
			`Roles he is looking for: ${profile.targetRoles.join(', ')}.`,
			`Spoken languages: ${profile.languages.map((l) => `${l.name} (${l.level})`).join(', ')}.`
		)
	});

	// ── Experience ─────────────────────────────────────────────────────────
	add({
		id: 'internship',
		title: `${internship.role} · ${internship.company}`,
		href: '/#experience',
		text: lines(
			`${internship.role} at ${internship.company}, ${internship.location}, ${internship.start} – ${internship.end} (expected to end ${internship.expectedEnd}).`,
			internship.summary,
			bullets(internship.cvBullets),
			'Confidentiality: SKAI Technology code, data, architecture and metrics are private and never shared.'
		)
	});
	for (const area of workAreas) {
		add({
			id: `area:${area.id}`,
			title: `Internship work: ${area.title}`,
			href: '/#experience',
			text: lines(
				`${area.title} — ${area.summary}`,
				bullets(
					area.items.map((i) => `${i.text} (${i.mode === 'hands-on' ? 'hands-on experience' : 'still researching'})`)
				),
				area.note
			)
		});
	}
	add({
		id: 'timeline',
		title: 'Internship timeline',
		href: '/#experience',
		text: internshipTimeline.map((m) => `- ${m.period}: ${m.title} — ${m.body} [${m.state}]`).join('\n')
	});
	add({
		id: 'education',
		title: 'Education — where Phoun studied',
		href: '/#journey',
		text: education
			.map((e) =>
				lines(
					`${e.school}${e.program ? ` — ${e.program}` : ''}${e.detail ? ` (${e.detail})` : ''}, ${e.location}${e.current ? ', current' : ''}.`,
					e.highlights.length > 0 && bullets(e.highlights)
				)
			)
			.join('\n')
	});
	add({
		id: 'journey',
		title: 'Career journey',
		href: '/#journey',
		text: journey.map((m) => `- ${m.period}: ${m.title} — ${m.body}`).join('\n')
	});

	// ── Projects ───────────────────────────────────────────────────────────
	for (const p of projects) {
		const href = `/projects/${p.slug}/`;
		add({
			id: `project:${p.slug}`,
			title: p.title,
			href,
			text: lines(
				`Project: ${p.title} — ${p.tagline}`,
				`Status: ${p.status}. Context: ${p.context}. Tech: ${p.tech.join(', ')}.`,
				p.summary,
				!!p.implemented?.length && `Implemented:\n${bullets(p.implemented)}`,
				!!p.planned?.length && `Planned (not built yet):\n${bullets(p.planned)}`,
				!!p.goals?.length && `Learning goals:\n${bullets(p.goals)}`,
				p.repo && `Code: ${p.repo}`,
				p.live && `${p.liveLabel ?? 'Live demo'}: ${p.live}`,
				p.demo && `Demo video: ${demoUrl(p.demo)}`,
				p.privateNote
			)
		});
		const cs = p.caseStudy;
		if (cs) {
			add({
				id: `case:${p.slug}`,
				title: `${p.title} — in depth`,
				href,
				text: lines(
					`Case study: ${p.title}.`,
					`Problem: ${cs.problem}`,
					`Why: ${cs.motivation}`,
					`Phoun's role: ${cs.role}`,
					`Approach:\n${bullets(cs.approach)}`,
					cs.architecture && `High-level flow: ${cs.architecture.join(' → ')}`,
					`Challenges:\n${bullets(cs.challenges)}`,
					`Current status: ${cs.status}`,
					`What he learned:\n${bullets(cs.learned)}`,
					!!cs.next?.length && `Next steps:\n${bullets(cs.next)}`
				)
			});
		}
	}
	for (const p of moreAiWork) add(compact(p, 'More AI work'));
	for (const p of earlierWork) add(compact(p, 'Earlier web project'));

	// ── Skills ─────────────────────────────────────────────────────────────
	for (const g of skillGroups) {
		add({
			id: `skills:${g.title}`,
			title: `Skills: ${g.title}`,
			href: '/#skills',
			text: `${g.title} skills: ${g.skills.join(', ')}. Where they were used: ${g.evidence}`
		});
	}
	add({
		id: 'tools',
		title: 'Core tools and how he uses them',
		href: '/#skills',
		text: heroSkills.map((s) => `- ${s.name} (${s.category}): ${s.description}`).join('\n')
	});
	add({
		id: 'learning',
		title: 'Currently learning',
		href: '/#skills',
		text: lines(
			`Currently learning: ${currentlyLearning.join(', ')}.`,
			bullets(learningNow.map((l) => `${l.topic} — ${l.note}`))
		)
	});

	// ── Research ───────────────────────────────────────────────────────────
	add({
		id: 'pipeline',
		title: 'Khmer OCR pipeline',
		href: '/#research',
		text: lines(
			'The Khmer OCR pipeline as Phoun studies it (general techniques only, nothing proprietary):',
			pipeline
				.map(
					(s) =>
						`${s.step}. ${s.title} (${s.short}) — ${s.detail} Techniques: ${s.techniques.join(', ')}. [${s.mode === 'hands-on' ? 'hands-on' : 'researching'}]`
				)
				.join('\n')
		)
	});
	add({
		id: 'khmer',
		title: 'Why Khmer OCR is hard',
		href: '/#research',
		text: lines(
			'Why Khmer script is hard for OCR:',
			bullets(khmerChallenges.map((c) => `${c.title}: ${c.body}`)),
			`Research principles:\n${bullets(principles)}`
		)
	});

	// ── This site ──────────────────────────────────────────────────────────
	add({
		id: 'site',
		title: 'About this portfolio and assistant',
		href: '/',
		text: 'This portfolio is built by Phoun with SvelteKit, Svelte 5, TypeScript and Tailwind CSS, prerendered to static pages. The chat assistant uses retrieval-augmented generation (RAG): it embeds the portfolio content with Google Gemini embeddings, retrieves the most relevant passages for each question, and asks a Gemini model to answer from them.'
	});

	return chunks;
}

export const chunks: readonly Chunk[] = build();
