<script lang="ts">
	import MousePointer2 from '@lucide/svelte/icons/mouse-pointer-2';
	import Pause from '@lucide/svelte/icons/pause';
	import Play from '@lucide/svelte/icons/play';
	import {
		siDocker,
		siFastapi,
		siGit,
		siGooglecolab,
		siKaggle,
		siNumpy,
		siOpencv,
		siPandas,
		siPostgresql,
		siPython,
		siPytorch,
		siSvelte,
		type SimpleIcon
	} from 'simple-icons';
	import Picture from '#lib/components/ui/Picture.svelte';
	import { heroSkills } from '#lib/content/skills.ts';
	import type { HeroSkillIcon } from '#lib/content/types.ts';

	const skillIcons: Record<HeroSkillIcon, SimpleIcon> = {
		python: siPython,
		fastapi: siFastapi,
		pytorch: siPytorch,
		opencv: siOpencv,
		numpy: siNumpy,
		pandas: siPandas,
		postgresql: siPostgresql,
		docker: siDocker,
		svelte: siSvelte,
		git: siGit,
		googlecolab: siGooglecolab,
		kaggle: siKaggle
	};

	const stars = [
		[9, 9, 2],
		[30, 4, 1],
		[59, 5, 2],
		[92, 15, 1],
		[96, 52, 2],
		[91, 84, 1],
		[61, 96, 1],
		[29, 96, 2],
		[4, 79, 1],
		[3, 43, 1],
		[35, 24, 1],
		[72, 27, 1],
		[77, 52, 1],
		[24, 68, 1]
	];

	let hovered = $state<string | null>(null);
	let focused = $state<string | null>(null);
	let selected = $state<string | null>(null);
	let paused = $state(false);

	const activeName = $derived(hovered ?? focused ?? selected);
</script>

<div class="orbit rise" class:is-paused={paused} style="--d: 320ms" role="group" aria-label="Skill constellation">
	<div class="orbit-toolbar">
		<span class="orbit-label"><span class="live-dot" aria-hidden="true"></span>Skill constellation</span>
		<button
			type="button"
			class="motion-toggle"
			onclick={() => (paused = !paused)}
			aria-label={paused ? 'Resume orbit animation' : 'Pause orbit animation'}
			aria-pressed={paused}
		>
			{#if paused}<Play size={12} aria-hidden="true" />{:else}<Pause size={12} aria-hidden="true" />{/if}
		</button>
	</div>

	<div class="stage">
		<div class="ambient" aria-hidden="true"></div>

		<svg class="connections" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
			<defs>
				<linearGradient id="orbit-stroke" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0%" stop-color="var(--accent)" />
					<stop offset="100%" stop-color="var(--accent-2)" />
				</linearGradient>
			</defs>
			<ellipse class="ring ring-outer rotating" cx="50" cy="50" rx="44" ry="39" />
			<ellipse class="ring ring-inner rotating-reverse" cx="50" cy="50" rx="31" ry="28" />
			{#each heroSkills as skill (skill.name)}
				{@const icon = skillIcons[skill.icon]}
				<line
					class="connector"
					class:is-active={activeName === skill.name}
					x1="50"
					y1="50"
					x2={skill.x}
					y2={skill.y}
					style="--skill-color: #{icon.hex}"
				/>
				<circle
					class="anchor"
					class:is-active={activeName === skill.name}
					cx={skill.x}
					cy={skill.y}
					r="0.55"
					style="--skill-color: #{icon.hex}"
				/>
			{/each}
		</svg>

		{#each stars as [x, y, size], i (i)}
			<span class="star" style="--x: {x}%; --y: {y}%; --size: {size}px; --delay: {i * -0.7}s" aria-hidden="true"></span>
		{/each}

		<div class="core">
			<div class="core-halo" aria-hidden="true"></div>
			<div class="core-orbit rotating-reverse" aria-hidden="true"><span></span></div>
			<div class="core-portrait">
				<Picture
					base="portrait-square"
					alt="Portrait of Phoun Phan"
					widths={[240, 420]}
					width={420}
					height={420}
					sizes="(min-width: 1024px) 120px, 96px"
					loading="eager"
					fetchpriority="high"
					class="h-full w-full object-cover"
				/>
			</div>
			<span class="core-badge" aria-hidden="true">AI × CODE</span>
		</div>

		{#each heroSkills as skill (skill.name)}
			{@const icon = skillIcons[skill.icon]}
			<div
				class="node"
				class:is-active={activeName === skill.name}
				style="--x: {skill.x}%; --y: {skill.y}%; --skill-color: #{icon.hex}"
			>
				<button
					type="button"
					class="skill-node"
					aria-label="{skill.name}. {skill.description}"
					aria-pressed={selected === skill.name}
					onmouseenter={() => (hovered = skill.name)}
					onmouseleave={() => (hovered = null)}
					onfocus={() => (focused = skill.name)}
					onblur={() => (focused = null)}
					onclick={(event) => {
						const isSelected = selected === skill.name;
						selected = isSelected ? null : skill.name;
						if (isSelected) {
							hovered = null;
							event.currentTarget.blur();
						}
					}}
					onkeydown={(event) => {
						if (event.key === 'Escape') {
							selected = null;
							event.currentTarget.blur();
						}
					}}
				>
					<span class="node-disc">
						<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true" focusable="false">
							<path d={icon.path} />
						</svg>
					</span>
					<span class="node-label">{skill.name}</span>
				</button>

				<div class="tooltip tooltip--{skill.tooltip}" aria-hidden="true">
					<span class="tooltip-category">{skill.category}</span>
					<strong>{skill.name}</strong>
					<p>{skill.description}</p>
				</div>
			</div>
		{/each}
	</div>

	<p class="orbit-hint"><MousePointer2 size={13} aria-hidden="true" /> Hover, focus or tap a skill to explore</p>
</div>

<style>
	.orbit {
		width: min(100%, 33rem);
		margin-inline: auto;
	}
	.orbit-toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.35rem;
		padding-inline: 0.4rem;
	}
	.orbit-label {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-mono);
		font-size: 0.625rem;
		letter-spacing: 0.13em;
		text-transform: uppercase;
		color: var(--subtle);
	}
	.live-dot {
		width: 0.35rem;
		height: 0.35rem;
		border-radius: 999px;
		background: var(--accent-2);
		box-shadow: 0 0 0 3px var(--accent-2-soft);
	}
	.motion-toggle {
		display: grid;
		place-items: center;
		width: 1.75rem;
		height: 1.75rem;
		border: 1px solid var(--line);
		border-radius: 999px;
		color: var(--subtle);
		background: var(--surface);
		cursor: pointer;
		transition:
			color 150ms ease,
			border-color 150ms ease;
	}
	.motion-toggle:hover {
		color: var(--fg);
		border-color: var(--line-strong);
	}
	.stage {
		position: relative;
		aspect-ratio: 1;
		isolation: isolate;
	}
	.ambient {
		position: absolute;
		inset: 8%;
		z-index: -1;
		border-radius: 50%;
		background:
			radial-gradient(38% 38% at 50% 50%, var(--glow-1), transparent 75%),
			radial-gradient(45% 45% at 65% 60%, var(--glow-2), transparent 75%);
	}
	.connections {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: visible;
	}
	.ring {
		fill: none;
		stroke: var(--line-strong);
		stroke-width: 1;
		stroke-dasharray: 0.35 1.1;
		vector-effect: non-scaling-stroke;
		transform-origin: 50px 50px;
		opacity: 0.7;
	}
	.ring-inner {
		stroke: url('#orbit-stroke');
		stroke-dasharray: 1.2 1.8;
		opacity: 0.3;
	}
	.rotating {
		animation: orbit-spin 80s linear infinite;
	}
	.rotating-reverse {
		animation: orbit-spin 46s linear infinite reverse;
	}
	.is-paused .rotating,
	.is-paused .rotating-reverse {
		animation-play-state: paused;
	}
	.connector {
		stroke: var(--line-strong);
		stroke-width: 1;
		vector-effect: non-scaling-stroke;
		opacity: 0.38;
		transition:
			stroke 180ms ease,
			opacity 180ms ease,
			stroke-width 180ms ease;
	}
	.connector.is-active {
		stroke: var(--skill-color);
		stroke-width: 1.5;
		opacity: 0.9;
	}
	.anchor {
		fill: var(--skill-color);
		opacity: 0.45;
		transition: opacity 180ms ease;
	}
	.anchor.is-active {
		opacity: 1;
	}
	.star {
		position: absolute;
		left: var(--x);
		top: var(--y);
		width: var(--size);
		height: var(--size);
		border-radius: 50%;
		background: var(--subtle);
		opacity: 0.35;
		animation: twinkle 5.6s ease-in-out var(--delay) infinite;
	}
	.is-paused .star {
		animation-play-state: paused;
	}
	.core {
		position: absolute;
		left: 50%;
		top: 50%;
		z-index: 3;
		width: 25%;
		aspect-ratio: 1;
		transform: translate(-50%, -50%);
		pointer-events: none;
	}
	.core-halo {
		position: absolute;
		inset: -55%;
		border-radius: 50%;
		background: radial-gradient(circle, var(--glow-1), transparent 68%);
	}
	.core-orbit {
		position: absolute;
		inset: -13%;
		border: 1px solid color-mix(in srgb, var(--accent) 28%, transparent);
		border-radius: 50%;
		transform-origin: center;
	}
	.core-orbit span {
		position: absolute;
		top: 50%;
		right: -3px;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--accent-2);
		box-shadow: 0 0 12px var(--accent-2);
	}
	.core-portrait {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		padding: 3px;
		border-radius: 32%;
		background: linear-gradient(145deg, var(--accent), var(--surface-strong) 45%, var(--accent-2));
		box-shadow:
			0 0 0 1px var(--line-strong),
			0 20px 50px -18px var(--glow-1);
	}
	.core-portrait::after {
		content: '';
		position: absolute;
		inset: 3px;
		border-radius: calc(32% - 3px);
		background: linear-gradient(180deg, transparent 55%, color-mix(in srgb, var(--bg) 65%, transparent));
		pointer-events: none;
	}
	.core-portrait :global(picture) {
		display: block;
		width: 100%;
		height: 100%;
	}
	.core-portrait :global(img) {
		border-radius: calc(32% - 3px);
	}
	.core-badge {
		position: absolute;
		left: 50%;
		bottom: -1.05rem;
		transform: translateX(-50%);
		padding: 0.28rem 0.55rem;
		border: 1px solid var(--line-strong);
		border-radius: 999px;
		background: var(--surface-strong);
		box-shadow: var(--shadow);
		font-family: var(--font-mono);
		font-size: 0.55rem;
		letter-spacing: 0.12em;
		white-space: nowrap;
		color: var(--accent-2);
	}
	.node {
		position: absolute;
		left: var(--x);
		top: var(--y);
		z-index: 2;
		transform: translate(-50%, -50%);
	}
	.node.is-active {
		z-index: 5;
	}
	.skill-node {
		display: grid;
		justify-items: center;
		gap: 0.35rem;
		min-width: 4rem;
		padding: 0;
		border: 0;
		background: transparent;
		color: var(--fg);
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
	}
	.node-disc {
		display: grid;
		place-items: center;
		width: clamp(2.75rem, 5.8vw, 3.5rem);
		aspect-ratio: 1;
		border: 1px solid var(--line-strong);
		border-radius: 1rem;
		color: color-mix(in srgb, var(--skill-color) 78%, var(--fg));
		background:
			linear-gradient(145deg, color-mix(in srgb, var(--skill-color) 10%, transparent), transparent 60%),
			color-mix(in srgb, var(--surface-strong) 92%, transparent);
		box-shadow:
			0 1px 0 rgb(255 255 255 / 0.06) inset,
			0 12px 24px -16px var(--skill-color);
		transition:
			transform 200ms var(--ease-out-soft),
			border-color 200ms ease,
			box-shadow 200ms ease;
	}
	.node-disc svg {
		width: 45%;
		height: 45%;
	}
	.node-label {
		font-family: var(--font-mono);
		font-size: clamp(0.56rem, 1vw, 0.65rem);
		line-height: 1;
		white-space: nowrap;
		color: var(--muted);
		transition: color 180ms ease;
	}
	.skill-node:hover .node-disc,
	.skill-node:focus-visible .node-disc,
	.node.is-active .node-disc {
		transform: translateY(-3px) scale(1.06);
		border-color: color-mix(in srgb, var(--skill-color) 65%, var(--line-strong));
		box-shadow:
			0 1px 0 rgb(255 255 255 / 0.08) inset,
			0 14px 30px -12px color-mix(in srgb, var(--skill-color) 55%, transparent);
	}
	.skill-node:hover .node-label,
	.skill-node:focus-visible .node-label,
	.node.is-active .node-label {
		color: var(--fg);
	}
	.skill-node:focus-visible {
		outline: none;
	}
	.skill-node:focus-visible .node-disc {
		outline: 2px solid var(--accent-2);
		outline-offset: 4px;
	}
	.tooltip {
		position: absolute;
		z-index: 10;
		width: 13.5rem;
		max-width: calc(100vw - 3rem);
		padding: 0.8rem 0.9rem;
		border: 1px solid color-mix(in srgb, var(--skill-color) 30%, var(--line-strong));
		border-radius: 0.85rem;
		background: color-mix(in srgb, var(--surface-strong) 96%, transparent);
		box-shadow: var(--shadow);
		opacity: 0;
		visibility: hidden;
		pointer-events: none;
		text-align: left;
		transition:
			opacity 160ms ease,
			transform 200ms var(--ease-out-soft),
			visibility 160ms ease;
	}
	.tooltip-category {
		display: block;
		margin-bottom: 0.2rem;
		font-family: var(--font-mono);
		font-size: 0.55rem;
		letter-spacing: 0.11em;
		text-transform: uppercase;
		color: color-mix(in srgb, var(--skill-color) 65%, var(--muted));
	}
	.tooltip strong {
		display: block;
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--fg);
	}
	.tooltip p {
		margin-top: 0.3rem;
		font-size: 0.6875rem;
		line-height: 1.55;
		color: var(--muted);
	}
	.tooltip--top {
		left: 50%;
		bottom: calc(100% + 0.7rem);
		transform: translate(-50%, 5px);
	}
	.tooltip--bottom {
		left: 50%;
		top: calc(100% + 0.7rem);
		transform: translate(-50%, -5px);
	}
	.tooltip--left {
		right: calc(100% + 0.7rem);
		top: 50%;
		transform: translate(5px, -50%);
	}
	.tooltip--right {
		left: calc(100% + 0.7rem);
		top: 50%;
		transform: translate(-5px, -50%);
	}
	.node.is-active .tooltip {
		opacity: 1;
		visibility: visible;
	}
	.node.is-active .tooltip--top {
		transform: translate(-50%, 0);
	}
	.node.is-active .tooltip--bottom {
		transform: translate(-50%, 0);
	}
	.node.is-active .tooltip--left {
		transform: translate(0, -50%);
	}
	.node.is-active .tooltip--right {
		transform: translate(0, -50%);
	}
	.orbit-hint {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		margin-top: -0.15rem;
		font-family: var(--font-mono);
		font-size: 0.625rem;
		color: var(--subtle);
		text-align: center;
	}
	@keyframes orbit-spin {
		to {
			transform: rotate(360deg);
		}
	}
	@keyframes twinkle {
		50% {
			opacity: 0.9;
			transform: scale(1.4);
		}
	}
	@media (max-width: 639px) {
		.orbit {
			width: min(100%, 24rem);
		}
		.node-disc {
			width: 2.65rem;
			border-radius: 0.85rem;
		}
		.skill-node {
			min-width: 3.4rem;
		}
		.tooltip {
			width: 12.5rem;
		}
	}
	@media (max-width: 360px) {
		.tooltip {
			width: 11rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.star {
			animation: none;
		}
	}
</style>
