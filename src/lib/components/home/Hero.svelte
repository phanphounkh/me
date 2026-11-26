<script lang="ts">
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Download from '@lucide/svelte/icons/download';
	import Mail from '@lucide/svelte/icons/mail';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import BrandIcon from '#lib/components/ui/BrandIcon.svelte';
	import { CV_PDF_PATH, profile } from '#lib/content/profile.ts';
	import SkillOrbit from './SkillOrbit.svelte';
</script>

<section id="home" class="hero" aria-labelledby="hero-name">
	<div class="backdrop" aria-hidden="true">
		<div class="grid-bg grid-mask"></div>
		<div class="glows"></div>
	</div>

	<div
		class="container-x relative grid items-center gap-14 pt-10 pb-20 lg:grid-cols-[1.12fr_0.88fr] lg:gap-10 lg:pt-16 lg:pb-28"
	>
		<div>
			<p class="rise eyebrow flex flex-wrap items-center gap-x-2 gap-y-1" style="--d: 0ms">
				<span>AI/ML Engineer</span><span class="sep" aria-hidden="true">/</span><span>
					Computer Vision &amp; OCR
				</span><span class="sep" aria-hidden="true">/</span><span>Python Developer</span>
			</p>

			<h1 id="hero-name" class="rise name uppercase" style="--d: 80ms">{profile.name}</h1>

			<p class="rise lcp headline" style="--d: 160ms">
				Building <span class="text-gradient">Intelligent Solutions</span> with AI &amp; Code.
			</p>

			<p class="rise lcp mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-[1.0625rem]" style="--d: 240ms">
				{profile.hero.intro}
			</p>

			<ul class="rise mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted" style="--d: 300ms">
				<li class="inline-flex items-center gap-2">
					<span class="status-dot" aria-hidden="true"></span>{profile.availability}
				</li>
				<li class="inline-flex items-center gap-2">
					<MapPin size={15} aria-hidden="true" class="text-subtle" />{profile.location}
				</li>
			</ul>

			<div class="rise mt-8 flex flex-wrap gap-3" style="--d: 380ms">
				<a href="#projects" class="btn btn-primary group">
					View My Projects
					<ArrowRight size={17} aria-hidden="true" class="transition-transform group-hover:translate-x-0.5" />
				</a>
				<a href={CV_PDF_PATH} class="btn btn-secondary" download>
					<Download size={17} aria-hidden="true" /> Download CV
				</a>
				<a href="#contact" class="btn btn-ghost">Contact Me</a>
			</div>

			<ul class="rise mt-8 flex items-center gap-2" style="--d: 460ms" aria-label="Profiles">
				<li>
					<a
						class="icon-btn"
						href={profile.links.github}
						target="_blank"
						rel="me noopener"
						aria-label="GitHub (opens in a new tab)"
					>
						<BrandIcon name="github" />
					</a>
				</li>
				{#if profile.links.linkedin}
					<li>
						<a
							class="icon-btn"
							href={profile.links.linkedin}
							target="_blank"
							rel="me noopener"
							aria-label="LinkedIn (opens in a new tab)"
						>
							<BrandIcon name="linkedin" />
						</a>
					</li>
				{/if}
				{#if profile.links.youtube}
					<li>
						<a
							class="icon-btn"
							href={profile.links.youtube}
							target="_blank"
							rel="me noopener"
							aria-label="YouTube (opens in a new tab)"
						>
							<BrandIcon name="youtube" />
						</a>
					</li>
				{/if}
				<li>
					<a class="icon-btn" href="mailto:{profile.email}" aria-label="Email {profile.email}">
						<Mail size={18} aria-hidden="true" />
					</a>
				</li>
				<li class="ml-2 hidden font-mono text-xs text-subtle sm:block">{profile.email}</li>
			</ul>
		</div>

		<div class="relative">
			<SkillOrbit />
		</div>
	</div>
</section>

<style>
	.hero {
		position: relative;
		isolation: isolate;
		/* Clip sideways only: the backdrop extends up behind the transparent navbar. */
		overflow-x: clip;
	}
	@media (min-width: 1024px) {
		.hero {
			min-height: calc(100svh - 4rem);
			display: grid;
			align-items: center;
		}
	}
	.backdrop {
		position: absolute;
		inset: -4rem 0 0;
		z-index: -1;
		overflow: hidden;
		pointer-events: none;
	}
	.grid-mask {
		position: absolute;
		inset: 0;
		mask-image: radial-gradient(70% 60% at 60% 35%, black, transparent 75%);
		-webkit-mask-image: radial-gradient(70% 60% at 60% 35%, black, transparent 75%);
	}
	/* Soft light behind the hero. Gradients fade to transparent inside the backdrop, so no
	   edge ever cuts through visible light; the layer drifts slowly. No filter: blur(). */
	.glows {
		position: absolute;
		inset: -6%;
		background:
			radial-gradient(34% 44% at 78% 30%, var(--glow-1), transparent 70%),
			radial-gradient(30% 34% at 10% 70%, var(--glow-2), transparent 70%);
		animation: drift 24s ease-in-out infinite alternate;
	}
	.sep {
		color: var(--subtle);
	}
	.name {
		margin-top: 1.25rem;
		font-size: clamp(2.75rem, 8.5vw, 5.25rem);
		line-height: 0.95;
		font-weight: 650;
		letter-spacing: -0.045em;
		color: var(--fg);
	}
	.headline {
		margin-top: 1.25rem;
		max-width: 34rem;
		font-size: clamp(1.375rem, 3vw, 1.875rem);
		line-height: 1.2;
		font-weight: 500;
		letter-spacing: -0.03em;
		color: var(--fg);
	}
	.status-dot {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 999px;
		background: var(--s-completed);
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--s-completed) 20%, transparent);
	}
	.rise {
		animation: rise 0.9s var(--ease-out-soft) both;
		animation-delay: var(--d, 0ms);
	}
	/* Opacity + transform only (composited). No filter: blur — it repaints every frame. */
	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(14px);
		}
	}
	/* The name, headline and intro are Largest Contentful Paint candidates (the intro on
	   phones): they slide in but are never invisible, so LCP is not delayed by animation. */
	.name.rise,
	.lcp.rise {
		animation-name: rise-visible;
	}
	@keyframes rise-visible {
		from {
			transform: translateY(14px);
		}
	}
	@keyframes drift {
		to {
			transform: translate(-3%, 2.5%);
		}
	}
</style>
