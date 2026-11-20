<script lang="ts">
	import type { ProjectStatus } from '#lib/content/types.ts';

	let { status, class: className = '' }: { status: ProjectStatus; class?: string } = $props();

	const colorVar: Record<ProjectStatus, string> = {
		Completed: '--s-completed',
		Prototype: '--s-prototype',
		'In Development': '--s-dev',
		Research: '--s-research',
		'Learning Project': '--s-learning'
	};
</script>

<span class="status {className}" style="--c: var({colorVar[status]})">
	<span class="dot" aria-hidden="true"></span>
	<span class="sr-only">Status: </span>{status}
</span>

<style>
	.status {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.2rem 0.6rem 0.2rem 0.5rem;
		border-radius: 999px;
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		line-height: 1.1rem;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		/* Pulled toward the foreground colour so the label keeps ≥4.5:1 on any tinted surface. */
		color: color-mix(in srgb, var(--c) 72%, var(--fg));
		background: color-mix(in srgb, var(--c) 11%, transparent);
		border: 1px solid color-mix(in srgb, var(--c) 28%, transparent);
		white-space: nowrap;
	}
	.dot {
		width: 0.375rem;
		height: 0.375rem;
		border-radius: 999px;
		background: currentColor;
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--c) 18%, transparent);
	}
</style>
