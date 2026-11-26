<script lang="ts">
	/**
	 * Click-to-play YouTube video. Until it is played only the thumbnail loads — no YouTube
	 * scripts or cookies — and the player then comes from youtube-nocookie.com.
	 */
	import Play from '@lucide/svelte/icons/play';
	import BrandIcon from '#lib/components/ui/BrandIcon.svelte';

	let { id, title }: { id: string; title: string } = $props();
	let playing = $state(false);
</script>

<div class="frame">
	{#if playing}
		<iframe
			src="https://www.youtube-nocookie.com/embed/{id}?autoplay=1&rel=0"
			{title}
			allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
			allowfullscreen
			referrerpolicy="strict-origin-when-cross-origin"
		></iframe>
	{:else}
		<button type="button" class="poster" onclick={() => (playing = true)} aria-label="Play demo video: {title}">
			<img
				src="https://i.ytimg.com/vi/{id}/maxresdefault.jpg"
				alt=""
				width="1280"
				height="720"
				loading="lazy"
				decoding="async"
			/>
			<span class="play" aria-hidden="true"><Play size={26} fill="currentColor" /></span>
		</button>
	{/if}
</div>
<a
	href="https://www.youtube.com/watch?v={id}"
	target="_blank"
	rel="noopener"
	class="mt-3 inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg"
>
	<BrandIcon name="youtube" size={15} /> Watch on YouTube<span class="sr-only"> (opens in a new tab)</span>
</a>

<style>
	.frame {
		position: relative;
		aspect-ratio: 16 / 9;
		overflow: hidden;
		border-radius: 1rem;
		border: 1px solid var(--line);
		background: #000;
		box-shadow: var(--shadow);
	}
	iframe,
	.poster {
		display: block;
		width: 100%;
		height: 100%;
		border: 0;
	}
	.poster {
		position: relative;
		padding: 0;
		background: none;
		cursor: pointer;
	}
	.poster img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 600ms var(--ease-out-soft);
	}
	.play {
		position: absolute;
		inset: 0;
		margin: auto;
		display: grid;
		place-items: center;
		width: 4.25rem;
		height: 4.25rem;
		padding-left: 0.2rem;
		border-radius: 999px;
		color: #fff;
		background: color-mix(in srgb, #000 58%, transparent);
		backdrop-filter: blur(6px);
		-webkit-backdrop-filter: blur(6px);
		transition:
			background 200ms ease,
			transform 300ms var(--ease-out-soft);
	}
	.poster:hover img {
		transform: scale(1.02);
	}
	.poster:hover .play,
	.poster:focus-visible .play {
		background: var(--accent);
		transform: scale(1.06);
	}
	.poster:focus-visible {
		outline: 2px solid var(--accent-2);
		outline-offset: -4px;
	}
	@media (prefers-reduced-motion: reduce) {
		.poster img,
		.play {
			transition: none;
		}
	}
</style>
