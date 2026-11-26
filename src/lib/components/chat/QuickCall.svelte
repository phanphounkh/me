<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import Clock from '@lucide/svelte/icons/clock';
	import Copy from '@lucide/svelte/icons/copy';
	import PhoneCall from '@lucide/svelte/icons/phone-call';
	import { profile } from '#lib/content/profile.ts';
	import { copyText } from './clipboard.ts';

	let copied = $state(false);
	let now = $state(new Date());

	// Phnom Penh local time, so callers in other time zones can pick a sensible moment.
	$effect(() => {
		const timer = setInterval(() => (now = new Date()), 30_000);
		return () => clearInterval(timer);
	});
	const localTime = $derived(
		new Intl.DateTimeFormat('en-GB', {
			timeZone: 'Asia/Phnom_Penh',
			weekday: 'short',
			hour: '2-digit',
			minute: '2-digit'
		}).format(now)
	);

	async function copyNumber() {
		copied = await copyText(profile.phone.display);
		if (copied) setTimeout(() => (copied = false), 2200);
	}
</script>

<div class="pane">
	<div class="card-call">
		<span class="ring" aria-hidden="true"><PhoneCall size={22} /></span>
		<p class="mt-4 text-xs font-medium tracking-wide text-subtle uppercase">Call Phoun</p>
		<a href="tel:{profile.phone.tel}" class="number">{profile.phone.display}</a>
		<p class="mt-2 inline-flex items-center gap-1.5 text-xs text-muted">
			<Clock size={13} aria-hidden="true" />
			{localTime} in Phnom Penh (UTC+7)
		</p>
	</div>

	<div class="grid gap-2">
		<a href="tel:{profile.phone.tel}" class="btn btn-primary btn-sm w-full" data-autofocus>
			<PhoneCall size={15} aria-hidden="true" /> Call now
		</a>
		<button type="button" class="btn btn-secondary btn-sm w-full" onclick={copyNumber}>
			{#if copied}<Check size={15} aria-hidden="true" /> Number copied{:else}<Copy size={15} aria-hidden="true" /> Copy number{/if}
		</button>
	</div>
	<p class="text-center text-xs text-subtle">On a computer? Copy the number and call from your phone.</p>
	<span class="sr-only" role="status">{copied ? 'Phone number copied' : ''}</span>
</div>

<style>
	.pane {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		padding: 1rem 0.9rem;
	}
	.card-call {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1.75rem 1rem 1.5rem;
		border-radius: 1rem;
		text-align: center;
		border: 1px solid var(--line);
		background: radial-gradient(120% 90% at 50% 0%, var(--accent-soft), transparent 70%), var(--surface);
	}
	.ring {
		display: grid;
		place-items: center;
		width: 3.5rem;
		height: 3.5rem;
		border-radius: 999px;
		color: var(--accent);
		background: var(--accent-soft);
		box-shadow: 0 0 0 8px color-mix(in srgb, var(--accent) 7%, transparent);
	}
	.number {
		margin-top: 0.35rem;
		font-size: 1.5rem;
		font-weight: 650;
		letter-spacing: -0.01em;
		color: var(--fg);
		font-variant-numeric: tabular-nums;
	}
	.number:hover {
		color: var(--accent);
	}
</style>
