<script lang="ts">
	import Mail from '@lucide/svelte/icons/mail';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import { navItems, sectionHref } from '#lib/config/nav.ts';
	import { profile } from '#lib/content/profile.ts';
	import BrandIcon from '#lib/components/ui/BrandIcon.svelte';
	import Logo from './Logo.svelte';

	const year = 2026;
</script>

<footer class="border-t border-line bg-bg-2">
	<div class="container-x grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
		<div class="max-w-sm">
			<Logo />
			<p class="mt-4 text-sm leading-relaxed text-muted">
				{profile.shortTitle}. Building practical AI for Khmer-language documents — with the software engineering to ship
				it.
			</p>
			<p class="mt-4 inline-flex items-center gap-2 text-sm text-subtle">
				<MapPin size={15} aria-hidden="true" />
				{profile.location}
			</p>
		</div>

		<div>
			<h2 class="eyebrow">Sections</h2>
			<ul class="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
				{#each navItems as item (item.id)}
					<li><a class="link-underline text-muted hover:text-fg" href={sectionHref(item.id)}>{item.label}</a></li>
				{/each}
			</ul>
		</div>

		<div>
			<h2 class="eyebrow">Elsewhere</h2>
			<ul class="mt-4 space-y-2 text-sm">
				<li>
					<a class="footer-link" href="mailto:{profile.email}"><Mail size={15} aria-hidden="true" />Email</a>
				</li>
				<li>
					<a class="footer-link" href={profile.links.github} rel="me noopener" target="_blank">
						<BrandIcon name="github" size={15} />GitHub · AI/ML<span class="sr-only"> (opens in a new tab)</span>
					</a>
				</li>
				<li>
					<a class="footer-link" href={profile.links.githubWeb} rel="me noopener" target="_blank">
						<BrandIcon name="github" size={15} />GitHub · Web projects<span class="sr-only"> (opens in a new tab)</span>
					</a>
				</li>
				{#if profile.links.linkedin}
					<li>
						<a class="footer-link" href={profile.links.linkedin} rel="me noopener" target="_blank">
							<BrandIcon name="linkedin" size={15} />LinkedIn<span class="sr-only"> (opens in a new tab)</span>
						</a>
					</li>
				{/if}
			</ul>
		</div>
	</div>
	<div class="border-t border-line">
		<div
			class="container-x flex flex-col gap-2 py-6 text-xs text-subtle sm:flex-row sm:items-center sm:justify-between"
		>
			<p>© {year} {profile.name}. All rights reserved.</p>
			<p>Built with SvelteKit &amp; Tailwind CSS · Static, no tracking.</p>
		</div>
	</div>
</footer>

<style>
	.footer-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--muted);
		transition: color 150ms ease;
	}
	.footer-link:hover {
		color: var(--fg);
	}
</style>
