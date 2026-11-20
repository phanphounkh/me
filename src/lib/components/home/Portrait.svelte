<script lang="ts">
	import { onMount } from 'svelte';
	import Pause from '@lucide/svelte/icons/pause';
	import Play from '@lucide/svelte/icons/play';
	import Picture from '#lib/components/ui/Picture.svelte';
	import { profile } from '#lib/content/profile.ts';

	/**
	 * Hero photo slideshow.
	 * - Timing is driven by the active dot's CSS progress animation (animationend → next slide), so
	 *   pausing freezes progress exactly where it is and resuming continues from there.
	 * - Pauses on hover, on keyboard focus, when off-screen, when the tab is hidden, and via the
	 *   pause button (WCAG 2.2.2). With prefers-reduced-motion it never auto-advances.
	 * - Only the first photo loads eagerly (it is the LCP image); the others load lazily.
	 */
	const photos = profile.hero.photos;
	const INTERVAL = 5500;

	let index = $state(0);
	let userPaused = $state(false);
	let hovering = $state(false);
	let focused = $state(false);
	let inView = $state(true);
	let pageVisible = $state(true);
	let reduced = $state(false);
	let mounted = $state(false);
	let root = $state<HTMLElement>();

	const autoplay = $derived(mounted && !reduced);
	const running = $derived(autoplay && !userPaused && !hovering && !focused && inView && pageVisible);
	const current = $derived(photos[index]!);

	function go(i: number) {
		index = (i + photos.length) % photos.length;
	}

	onMount(() => {
		const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
		reduced = motion.matches;
		const onMotion = () => (reduced = motion.matches);
		motion.addEventListener('change', onMotion);

		const onVisibility = () => (pageVisible = document.visibilityState === 'visible');
		document.addEventListener('visibilitychange', onVisibility);

		const io = new IntersectionObserver(([entry]) => (inView = !!entry?.isIntersecting), { threshold: 0.2 });
		if (root) io.observe(root);

		mounted = true;
		return () => {
			motion.removeEventListener('change', onMotion);
			document.removeEventListener('visibilitychange', onVisibility);
			io.disconnect();
		};
	});

	function onFocusOut(event: FocusEvent) {
		if (!root?.contains(event.relatedTarget as Node | null)) focused = false;
	}
</script>

<div
	bind:this={root}
	class="portrait"
	role="region"
	aria-roledescription="carousel"
	aria-label="Photos of {profile.name}"
	onmouseenter={() => (hovering = true)}
	onmouseleave={() => (hovering = false)}
	onfocusin={() => (focused = true)}
	onfocusout={onFocusOut}
>
	<div class="glow" aria-hidden="true"></div>

	<div class="stage">
		<div class="frame">
			<div class="photo" aria-live={running ? 'off' : 'polite'}>
				{#each photos as photo, i (photo.base)}
					<div
						class="slide"
						class:active={i === index}
						role="group"
						aria-roledescription="slide"
						aria-label="{i + 1} of {photos.length}: {photo.title}"
						aria-hidden={i !== index}
					>
						<Picture
							base={photo.base}
							alt={photo.alt}
							widths={[400, 720]}
							width={720}
							height={900}
							formats={['avif', 'webp', 'jpg']}
							sizes="(min-width: 1024px) 384px, (min-width: 640px) 360px, 78vw"
							loading={i === 0 ? 'eager' : 'lazy'}
							fetchpriority={i === 0 ? 'high' : 'low'}
							class="h-full w-full object-cover"
						/>
					</div>
				{/each}
				<div class="scan" aria-hidden="true"></div>
			</div>
			<!-- Detection-box corners and a label that "reads" each photo: a nod to OCR. -->
			<span class="corner tl" aria-hidden="true"></span>
			<span class="corner tr" aria-hidden="true"></span>
			<span class="corner bl" aria-hidden="true"></span>
			<span class="corner br" aria-hidden="true"></span>
			{#key current.tag}
				<span class="label" aria-hidden="true">phoun_phan · {current.tag}</span>
			{/key}
		</div>

		<p class="caption">
			<span class="pulse" aria-hidden="true"></span>
			<span>
				<span class="block font-mono text-[0.7rem] tracking-[0.14em] text-subtle uppercase">Currently</span>
				<span class="block text-sm font-medium text-fg">{profile.currentRole} · {profile.company}</span>
			</span>
		</p>
	</div>

	<div class="controls">
		{#if autoplay}
			<button
				type="button"
				class="play"
				onclick={() => (userPaused = !userPaused)}
				aria-label={userPaused ? 'Play slideshow' : 'Pause slideshow'}
			>
				{#if userPaused}<Play size={14} aria-hidden="true" />{:else}<Pause size={14} aria-hidden="true" />{/if}
			</button>
		{/if}
		<div class="dots" role="group" aria-label="Choose a photo">
			{#each photos as photo, i (photo.base)}
				<button
					type="button"
					class="dot"
					class:active={i === index}
					onclick={() => go(i)}
					aria-label="Show photo {i + 1}: {photo.title}"
					aria-current={i === index ? 'true' : undefined}
				>
					<span class="track" aria-hidden="true">
						{#if i === index && autoplay}
							{#key index}
								<span
									class="fill"
									class:paused={!running}
									style="--dur: {INTERVAL}ms"
									onanimationend={() => go(index + 1)}
								></span>
							{/key}
						{/if}
					</span>
				</button>
			{/each}
		</div>
	</div>
</div>

<style>
	.portrait {
		position: relative;
		width: min(100%, 26rem);
		margin-inline: auto;
		padding: 1rem;
	}
	.glow {
		position: absolute;
		inset: 8% 4% 12% 8%;
		border-radius: 2.5rem;
		background:
			radial-gradient(60% 60% at 70% 20%, var(--glow-1), transparent 70%),
			radial-gradient(60% 60% at 20% 90%, var(--glow-2), transparent 70%);
		/* Gradients are already soft — no filter: blur(), which is costly to repaint. */
		animation: breathe 9s ease-in-out infinite;
	}
	.stage {
		position: relative;
	}
	.frame {
		position: relative;
		border-radius: 1.75rem;
		padding: 1px;
		background: linear-gradient(
			150deg,
			color-mix(in srgb, var(--accent) 70%, transparent),
			var(--line) 35%,
			var(--line) 65%,
			color-mix(in srgb, var(--accent-2) 60%, transparent)
		);
		box-shadow: var(--shadow);
		animation: frame-in 1s var(--ease-out-soft) 0.15s both;
	}
	.photo {
		position: relative;
		aspect-ratio: 4 / 5;
		overflow: hidden;
		border-radius: calc(1.75rem - 1px);
		background: var(--surface-strong);
	}
	/* Subtle colour grade so every photo sits in the navy palette and the caption stays legible. */
	.photo::after {
		content: '';
		position: absolute;
		inset: 0;
		background:
			linear-gradient(180deg, transparent 60%, color-mix(in srgb, var(--bg) 50%, transparent)),
			linear-gradient(140deg, rgb(37 99 235 / 0.08), transparent 45%);
		pointer-events: none;
	}

	/* Crossfade + slow zoom (opacity/transform only — composited, no repaint per frame). */
	.slide {
		position: absolute;
		inset: 0;
		opacity: 0;
		transition: opacity 900ms ease;
	}
	.slide.active {
		opacity: 1;
	}
	.slide :global(img) {
		transform: scale(1.06);
		transition: transform 7s cubic-bezier(0.2, 0.6, 0.2, 1);
	}
	.slide.active :global(img) {
		transform: scale(1);
	}

	.scan {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		height: 28%;
		background: linear-gradient(
			180deg,
			transparent,
			rgb(52 213 238 / 0.16) 85%,
			rgb(52 213 238 / 0.65) 99%,
			transparent
		);
		transform: translateY(-110%);
		animation: scan 2.2s cubic-bezier(0.45, 0, 0.2, 1) 0.7s 1 both;
		z-index: 1;
		pointer-events: none;
	}
	.corner {
		position: absolute;
		width: 1.25rem;
		height: 1.25rem;
		border-color: var(--accent-2);
		border-style: solid;
		animation: corner-in 0.7s var(--ease-out-soft) 0.9s both;
	}
	.tl {
		top: -0.6rem;
		left: -0.6rem;
		border-width: 2px 0 0 2px;
		border-top-left-radius: 0.5rem;
	}
	.tr {
		top: -0.6rem;
		right: -0.6rem;
		border-width: 2px 2px 0 0;
		border-top-right-radius: 0.5rem;
	}
	.bl {
		bottom: -0.6rem;
		left: -0.6rem;
		border-width: 0 0 2px 2px;
		border-bottom-left-radius: 0.5rem;
	}
	.br {
		bottom: -0.6rem;
		right: -0.6rem;
		border-width: 0 2px 2px 0;
		border-bottom-right-radius: 0.5rem;
	}
	.label {
		position: absolute;
		top: -0.65rem;
		left: 1.25rem;
		padding: 0.1rem 0.45rem;
		border-radius: 0.3rem;
		font-family: var(--font-mono);
		font-size: 0.625rem;
		letter-spacing: 0.06em;
		color: var(--bg);
		background: var(--accent-2);
		animation: corner-in 0.6s var(--ease-out-soft) both;
	}
	.caption {
		position: absolute;
		left: -1.25rem;
		bottom: 1.25rem;
		z-index: 2;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.7rem 1rem 0.7rem 0.85rem;
		border-radius: 1rem;
		border: 1px solid var(--line-strong);
		/* Near-opaque instead of backdrop-filter: the photos beneath animate, and a backdrop
		   blur would be recomputed every frame. */
		background: color-mix(in srgb, var(--surface-strong) 94%, transparent);
		box-shadow: var(--shadow);
		max-width: calc(100% + 0.5rem);
		animation: caption-in 0.8s var(--ease-out-soft) 1.2s both;
	}
	@media (min-width: 640px) {
		.caption {
			left: -2.75rem;
		}
	}
	.pulse {
		position: relative;
		flex: none;
		width: 0.6rem;
		height: 0.6rem;
		border-radius: 999px;
		background: var(--s-completed);
	}
	.pulse::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		background: inherit;
		animation: ping 2.4s ease-out infinite;
	}

	/* Controls: pause/play + dots with a progress fill on the active one. */
	.controls {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		margin-top: 1.5rem;
		animation: caption-in 0.8s var(--ease-out-soft) 1.4s both;
	}
	.play {
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		border-radius: 999px;
		color: var(--muted);
		border: 1px solid var(--line);
		background: var(--surface);
		transition:
			color 150ms ease,
			border-color 150ms ease;
	}
	.play:hover {
		color: var(--fg);
		border-color: var(--line-strong);
	}
	.dots {
		display: flex;
		align-items: center;
	}
	.dot {
		display: grid;
		place-items: center;
		min-width: 1.75rem;
		height: 2rem; /* ≥24px target even though the visible pill is small */
		padding-inline: 0.25rem;
	}
	.track {
		position: relative;
		display: block;
		width: 0.5rem;
		height: 0.375rem;
		overflow: hidden;
		border-radius: 999px;
		background: var(--line-strong);
		transition:
			width 300ms var(--ease-out-soft),
			background-color 150ms ease;
	}
	.dot:hover .track {
		background: var(--subtle);
	}
	.dot.active .track {
		width: 2rem;
		background: color-mix(in srgb, var(--accent) 30%, var(--line-strong));
	}
	.fill {
		position: absolute;
		inset: 0;
		border-radius: inherit;
		background: linear-gradient(90deg, var(--accent), var(--accent-2));
		transform-origin: left;
		animation: progress var(--dur) linear both;
	}
	.fill.paused {
		animation-play-state: paused;
	}

	/* The photo can be the LCP element on desktop: keep it visible from the first frame
	   (transform-only entrance, no opacity or filter animation). */
	@keyframes frame-in {
		from {
			transform: translateY(16px) scale(0.98);
		}
	}
	@keyframes progress {
		from {
			transform: scaleX(0);
		}
		to {
			transform: scaleX(1);
		}
	}
	@keyframes scan {
		0% {
			transform: translateY(-110%);
			opacity: 1;
		}
		85% {
			opacity: 1;
		}
		100% {
			transform: translateY(380%);
			opacity: 0;
		}
	}
	@keyframes corner-in {
		from {
			opacity: 0;
			transform: scale(1.4);
		}
	}
	@keyframes caption-in {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
	}
	@keyframes breathe {
		0%,
		100% {
			opacity: 0.85;
			transform: scale(1);
		}
		50% {
			opacity: 1;
			transform: scale(1.04);
		}
	}
	@keyframes ping {
		0% {
			transform: scale(1);
			opacity: 0.7;
		}
		80%,
		100% {
			transform: scale(2.6);
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.scan {
			display: none;
		}
		.slide :global(img) {
			transform: none;
		}
	}
</style>
