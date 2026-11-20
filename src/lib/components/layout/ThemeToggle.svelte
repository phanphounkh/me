<script lang="ts">
	import Moon from '@lucide/svelte/icons/moon';
	import Sun from '@lucide/svelte/icons/sun';
	import { theme } from '#lib/state/theme.svelte.ts';

	const label = $derived(theme.current === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
</script>

<button type="button" class="icon-btn" onclick={() => theme.toggle()} aria-label={label} title={label}>
	{#if theme.current === 'dark'}
		<Sun size={18} aria-hidden="true" />
	{:else}
		<Moon size={18} aria-hidden="true" />
	{/if}
</button>
