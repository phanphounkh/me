<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import About from '#lib/components/home/About.svelte';
	import Contact from '#lib/components/home/Contact.svelte';
	import Experience from '#lib/components/home/Experience.svelte';
	import Hero from '#lib/components/home/Hero.svelte';
	import Journey from '#lib/components/home/Journey.svelte';
	import Projects from '#lib/components/home/Projects.svelte';
	import Research from '#lib/components/home/Research.svelte';
	import Resume from '#lib/components/home/Resume.svelte';
	import Skills from '#lib/components/home/Skills.svelte';
	import { SITE_URL, profile } from '#lib/content/profile.ts';
	import { skillGroups } from '#lib/content/skills.ts';

	const sameAs = [profile.links.github, profile.links.githubWeb, profile.links.linkedin].filter(
		(u): u is string => !!u
	);

	const jsonLd = [
		{
			'@context': 'https://schema.org',
			'@type': 'Person',
			name: profile.name,
			url: SITE_URL,
			image: `${SITE_URL}/images/portrait-square-420.jpg`,
			jobTitle: profile.title,
			description: profile.summary,
			email: `mailto:${profile.email}`,
			address: { '@type': 'PostalAddress', addressLocality: 'Phnom Penh', addressCountry: 'KH' },
			worksFor: { '@type': 'Organization', name: profile.company },
			alumniOf: { '@type': 'EducationalOrganization', name: 'Passerelles numériques Cambodia' },
			knowsLanguage: profile.languages.map((l) => l.name),
			knowsAbout: [...new Set(skillGroups.flatMap((g) => g.skills))].slice(0, 24),
			sameAs
		},
		{
			'@context': 'https://schema.org',
			'@type': 'WebSite',
			name: `${profile.name} — Portfolio`,
			url: SITE_URL
		}
	];
</script>

<Seo
	title="{profile.name} — AI/ML Engineer · Computer Vision & Khmer OCR"
	description="Portfolio and CV of {profile.name}, an AI/ML Engineering Intern at SKAI Technology in Phnom Penh working on computer vision, Khmer OCR research and Python software."
	path="/"
	type="profile"
	{jsonLd}
/>

<Hero />
<About />
<Journey />
<Experience />
<Projects />
<Skills />
<Research />
<Resume />
<Contact />
