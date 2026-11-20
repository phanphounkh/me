<script lang="ts">
	import Picture from '#lib/components/ui/Picture.svelte';
	import { profile } from '#lib/content/profile.ts';
</script>

<figure class="portrait">
	<div class="glow" aria-hidden="true"></div>
	<div class="frame">
		<div class="photo">
			<Picture
				base="portrait"
				alt="Portrait of {profile.name} standing on a street in Phnom Penh, wearing a white polo shirt."
				widths={[360, 560]}
				width={560}
				height={700}
				formats={['avif', 'webp', 'jpg']}
				sizes="(min-width: 1024px) 420px, (min-width: 640px) 360px, 78vw"
				loading="eager"
				fetchpriority="high"
				class="h-full w-full object-cover"
			/>
			<div class="scan" aria-hidden="true"></div>
		</div>
		<!-- Detection-box corners: a nod to OCR bounding boxes. -->
		<span class="corner tl" aria-hidden="true"></span>
		<span class="corner tr" aria-hidden="true"></span>
		<span class="corner bl" aria-hidden="true"></span>
		<span class="corner br" aria-hidden="true"></span>
		<span class="label" aria-hidden="true">phoun_phan · phnom_penh</span>
	</div>

	<figcaption class="caption">
		<span class="pulse" aria-hidden="true"></span>
		<span>
			<span class="block text-[0.7rem] font-mono uppercase tracking-[0.14em] text-subtle">Currently</span>
			<span class="block text-sm font-medium text-fg">{profile.currentRole} · {profile.company}</span>
		</span>
	</figcaption>
</figure>

<style>
	.portrait {
		position: relative;
		width: min(100%, 26rem);
		margin-inline: auto;
		padding: 1rem;
	}
	.glow {
		position: absolute;
		inset: 8% 4% 4% 8%;
		border-radius: 2.5rem;
		background:
			radial-gradient(60% 60% at 70% 20%, var(--glow-1), transparent 70%),
			radial-gradient(60% 60% at 20% 90%, var(--glow-2), transparent 70%);
		/* Gradients are already soft — no filter: blur(), which is costly to repaint. */
		animation: breathe 9s ease-in-out infinite;
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
	/* Subtle colour grade so the outdoor photo sits in the navy palette. */
	.photo::after {
		content: '';
		position: absolute;
		inset: 0;
		background:
			linear-gradient(180deg, transparent 55%, color-mix(in srgb, var(--bg) 55%, transparent)),
			linear-gradient(140deg, rgb(37 99 235 / 0.1), transparent 45%);
		pointer-events: none;
	}
	.photo :global(img) {
		animation: photo-in 1.2s var(--ease-out-soft) 0.2s both;
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
		animation: corner-in 0.7s var(--ease-out-soft) 1.1s both;
	}
	.caption {
		position: absolute;
		left: -0.25rem;
		bottom: 2.25rem;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.7rem 1rem 0.7rem 0.85rem;
		border-radius: 1rem;
		border: 1px solid var(--line-strong);
		/* Near-opaque instead of backdrop-filter: the photo beneath animates on load, and a
		   backdrop blur would be recomputed every frame. */
		background: color-mix(in srgb, var(--surface-strong) 94%, transparent);
		box-shadow: var(--shadow);
		max-width: calc(100% - 1rem);
		animation: caption-in 0.8s var(--ease-out-soft) 1.2s both;
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
	@media (min-width: 640px) {
		.caption {
			left: -1.75rem;
		}
	}

	/* The photo can be the LCP element on desktop: keep it visible from the first frame
	   (transform-only entrance, no opacity or filter animation). */
	@keyframes frame-in {
		from {
			transform: translateY(16px) scale(0.98);
		}
	}
	@keyframes photo-in {
		from {
			transform: scale(1.06);
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
	}
</style>
