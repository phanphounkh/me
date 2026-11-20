<script lang="ts">
	import Briefcase from '@lucide/svelte/icons/briefcase';
	import GraduationCap from '@lucide/svelte/icons/graduation-cap';
	import Languages from '@lucide/svelte/icons/languages';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import { reveal } from '#lib/actions/reveal.ts';
	import SectionHeading from '#lib/components/ui/SectionHeading.svelte';
	import { profile } from '#lib/content/profile.ts';

	const facts = [
		{ icon: Briefcase, label: 'Now', value: `${profile.currentRole}, ${profile.company}` },
		{ icon: GraduationCap, label: 'Education', value: 'Web Programming, Passerelles numériques Cambodia' },
		{ icon: MapPin, label: 'Based in', value: profile.location },
		{ icon: Languages, label: 'Languages', value: profile.languages.map((l) => `${l.name} (${l.level})`).join(' · ') }
	];
</script>

<section id="about" class="section" aria-labelledby="about-title">
	<div class="container-x">
		<SectionHeading
			id="about"
			index="01"
			eyebrow="About me"
			title="From web programming to intelligent document processing."
		/>

		<div class="mt-12 grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
			<div class="prose-body max-w-2xl text-[1.0625rem] leading-[1.75] text-muted" use:reveal>
				{#each profile.about as paragraph, i (i)}
					<p class:text-fg={i === 0}>{paragraph}</p>
				{/each}
			</div>

			<aside class="space-y-5" aria-label="Quick facts">
				<dl class="card divide-y divide-line overflow-hidden" use:reveal={80}>
					{#each facts as fact (fact.label)}
						<div class="flex gap-4 px-5 py-4">
							<dt class="flex w-28 flex-none items-center gap-2 text-sm text-subtle">
								<fact.icon size={16} aria-hidden="true" />{fact.label}
							</dt>
							<dd class="text-sm text-fg">{fact.value}</dd>
						</div>
					{/each}
				</dl>

				<div class="card p-5" use:reveal={140}>
					<h3 class="text-sm font-medium text-fg">Interests</h3>
					<ul class="mt-3 flex flex-wrap gap-2">
						{#each profile.interests as interest (interest)}
							<li class="chip">{interest}</li>
						{/each}
					</ul>
				</div>

				<div class="card p-5" use:reveal={200}>
					<h3 class="text-sm font-medium text-fg">Roles I'm looking for</h3>
					<ul class="mt-3 grid gap-1.5 text-sm text-muted sm:grid-cols-2">
						{#each profile.targetRoles as role (role)}
							<li class="flex items-start gap-2">
								<span class="mt-2 h-1 w-1 flex-none rounded-full bg-accent-2"></span>{role}
							</li>
						{/each}
					</ul>
				</div>
			</aside>
		</div>
	</div>
</section>
