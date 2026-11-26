<script lang="ts">
	import { tick } from 'svelte';
	import Check from '@lucide/svelte/icons/check';
	import Copy from '@lucide/svelte/icons/copy';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import Send from '@lucide/svelte/icons/send';
	import { profile } from '#lib/content/profile.ts';
	import { copyText } from './clipboard.ts';

	/**
	 * Quick email: drafts the message in the visitor's own mail app (mailto:) or in Gmail.
	 * Nothing is sent or stored by this site.
	 */
	let name = $state('');
	let email = $state('');
	let message = $state('');
	let errors = $state<{ name?: string; email?: string; message?: string }>({});
	let status = $state('');
	let composed = $state('');
	let copied = $state(false);
	let form = $state<HTMLFormElement>();

	const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	function draft() {
		const subject = `Portfolio enquiry from ${name.trim()}`;
		const body = `${message.trim()}\n\n— ${name.trim()}\n${email.trim()}`;
		return { subject: encodeURIComponent(subject), body: encodeURIComponent(body) };
	}

	async function validate() {
		const next: typeof errors = {};
		if (!name.trim()) next.name = 'Please enter your name.';
		if (!EMAIL_RE.test(email.trim())) next.email = 'Please enter a valid email address.';
		if (message.trim().length < 10) next.message = 'Please write at least 10 characters.';
		errors = next;
		if (Object.keys(next).length === 0) return true;
		await tick();
		form?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
		return false;
	}

	async function onsubmit(event: SubmitEvent) {
		event.preventDefault();
		if (!(await validate())) return;
		const { subject, body } = draft();
		composed = `mailto:${profile.email}?subject=${subject}&body=${body}`;
		status = 'Your email app should open with the message ready to send.';
		window.location.href = composed;
	}

	async function openGmail() {
		if (!(await validate())) return;
		const { subject, body } = draft();
		const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(profile.email)}&su=${subject}&body=${body}`;
		window.open(url, '_blank', 'noopener');
		composed = '';
		status = 'Gmail opened in a new tab with your message.';
	}

	async function copyAddress() {
		copied = await copyText(profile.email);
		composed = '';
		status = copied ? 'Email address copied.' : '';
		if (copied) setTimeout(() => (copied = false), 2200);
	}
</script>

<form bind:this={form} class="pane" novalidate {onsubmit}>
	<p class="text-sm text-muted">
		Write to <span class="font-medium text-fg">{profile.email}</span> — this opens a ready-to-send draft.
	</p>

	<div class="grid gap-3 sm:grid-cols-2">
		<div>
			<label for="qe-name" class="label">Your name</label>
			<input
				id="qe-name"
				data-autofocus
				autocomplete="name"
				class="input"
				bind:value={name}
				aria-invalid={errors.name ? 'true' : undefined}
				aria-describedby={errors.name ? 'qe-name-err' : undefined}
			/>
			{#if errors.name}<p id="qe-name-err" class="err">{errors.name}</p>{/if}
		</div>
		<div>
			<label for="qe-email" class="label">Your email</label>
			<input
				id="qe-email"
				type="email"
				autocomplete="email"
				class="input"
				bind:value={email}
				aria-invalid={errors.email ? 'true' : undefined}
				aria-describedby={errors.email ? 'qe-email-err' : undefined}
			/>
			{#if errors.email}<p id="qe-email-err" class="err">{errors.email}</p>{/if}
		</div>
	</div>
	<div>
		<label for="qe-message" class="label">Message</label>
		<textarea
			id="qe-message"
			rows="4"
			class="input resize-none"
			placeholder="Hi Phoun, I'd like to talk about…"
			bind:value={message}
			aria-invalid={errors.message ? 'true' : undefined}
			aria-describedby={errors.message ? 'qe-message-err' : undefined}></textarea>
		{#if errors.message}<p id="qe-message-err" class="err">{errors.message}</p>{/if}
	</div>

	<div class="grid gap-2">
		<button type="submit" class="btn btn-primary btn-sm w-full">
			<Send size={15} aria-hidden="true" /> Open in email app
		</button>
		<div class="grid grid-cols-2 gap-2">
			<button type="button" class="btn btn-secondary btn-sm" onclick={openGmail}>
				<ExternalLink size={15} aria-hidden="true" /> Gmail
			</button>
			<button type="button" class="btn btn-secondary btn-sm" onclick={copyAddress}>
				{#if copied}<Check size={15} aria-hidden="true" /> Copied{:else}<Copy size={15} aria-hidden="true" /> Copy address{/if}
			</button>
		</div>
	</div>
	<p class="text-xs text-subtle" role="status" aria-live="polite">
		{status}
		{#if composed}If nothing happened, <a class="text-accent underline" href={composed}>open the draft again</a>.{/if}
	</p>
</form>

<style>
	.pane {
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		padding: 1rem 0.9rem;
	}
	.label {
		display: block;
		margin-bottom: 0.3rem;
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--fg);
	}
	.input {
		width: 100%;
		min-height: 2.5rem;
		padding: 0.5rem 0.75rem;
		border-radius: 0.65rem;
		font-size: 0.9375rem;
		color: var(--fg);
		background: var(--bg);
		border: 1px solid var(--line-strong);
		transition:
			border-color 150ms ease,
			box-shadow 150ms ease;
	}
	.input::placeholder {
		color: var(--subtle);
	}
	.input:focus {
		outline: none;
		border-color: var(--accent);
		box-shadow: 0 0 0 3px var(--accent-soft);
	}
	.input[aria-invalid='true'] {
		border-color: #f87171;
	}
	.err {
		margin-top: 0.3rem;
		font-size: 0.75rem;
		color: #f87171;
	}
	:global([data-theme='light']) .err {
		color: #b91c1c;
	}
	:global([data-theme='light']) .input[aria-invalid='true'] {
		border-color: #b91c1c;
	}
</style>
