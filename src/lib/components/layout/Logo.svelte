<script lang="ts">
	import { profile } from '#lib/content/profile.ts';
</script>

<a href="/" class="group inline-flex items-center gap-2.5 rounded-lg">
	<span class="mark" aria-hidden="true">
		<span class="font-mono text-[0.8rem] font-semibold tracking-tight">PP</span>
	</span>
	<span class="text-[0.95rem] font-semibold tracking-tight text-fg">
		{profile.name}<span class="sr-only"> — home</span>
	</span>
</a>

<style>
	/* Monogram framed by OCR-style detection corners. */
	.mark {
		position: relative;
		display: grid;
		place-items: center;
		width: 2.125rem;
		height: 2.125rem;
		border-radius: 0.6rem;
		color: var(--fg);
		background: linear-gradient(140deg, var(--accent-soft), var(--accent-2-soft));
		border: 1px solid var(--line-strong);
	}
	.mark::before,
	.mark::after {
		content: '';
		position: absolute;
		width: 0.45rem;
		height: 0.45rem;
		border-color: var(--accent-2);
		border-style: solid;
		transition: transform 220ms var(--ease-out-soft);
	}
	.mark::before {
		top: -3px;
		left: -3px;
		border-width: 1.5px 0 0 1.5px;
		border-top-left-radius: 3px;
	}
	.mark::after {
		bottom: -3px;
		right: -3px;
		border-width: 0 1.5px 1.5px 0;
		border-bottom-right-radius: 3px;
	}
	:global(.group:hover) .mark::before {
		transform: translate(-2px, -2px);
	}
	:global(.group:hover) .mark::after {
		transform: translate(2px, 2px);
	}
</style>
