<script lang="ts">
	import { tick } from 'svelte';
	import Send from '@lucide/svelte/icons/send';
	import { profile } from '#lib/content/profile.ts';

	/**
	 * The site is static (no server), so this form composes an email in the visitor's own
	 * mail app via mailto: — it never pretends to "send" anything on its own.
	 */
	let name = $state('');
	let email = $state('');
	let message = $state('');
	let errors = $state<{ name?: string; email?: string; message?: string }>({});
	let status = $state('');

	const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	function validate() {
		const next: typeof errors = {};
		if (!name.trim()) next.name = 'Please enter your name.';
		if (!EMAIL_RE.test(email.trim())) next.email = 'Please enter a valid email address.';
		if (message.trim().length < 10) next.message = 'Please write a message of at least 10 characters.';
		errors = next;
		return Object.keys(next).length === 0;
	}

	let composed = $state('');

	async function onsubmit(event: SubmitEvent) {
		event.preventDefault();
		const form = event.currentTarget as HTMLFormElement;
		status = '';
		composed = '';
		if (!validate()) {
			await tick(); // let the error state render before moving focus
			form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
			return;
		}
		const subject = `Portfolio enquiry from ${name.trim()}`;
		const body = `${message.trim()}\n\n— ${name.trim()}\n${email.trim()}`;
		composed = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
		status = 'Your email app should open with the message ready to send.';
		window.location.href = composed;
	}
</script>

<form class="card space-y-5 p-6 sm:p-8" novalidate {onsubmit} aria-describedby="form-note">
	<div class="grid gap-5 sm:grid-cols-2">
		<div>
			<label for="cf-name" class="label">Name</label>
			<input
				id="cf-name"
				name="name"
				autocomplete="name"
				class="input"
				bind:value={name}
				aria-invalid={errors.name ? 'true' : undefined}
				aria-describedby={errors.name ? 'cf-name-err' : undefined}
			/>
			{#if errors.name}<p id="cf-name-err" class="err">{errors.name}</p>{/if}
		</div>
		<div>
			<label for="cf-email" class="label">Email</label>
			<input
				id="cf-email"
				name="email"
				type="email"
				autocomplete="email"
				class="input"
				bind:value={email}
				aria-invalid={errors.email ? 'true' : undefined}
				aria-describedby={errors.email ? 'cf-email-err' : undefined}
			/>
			{#if errors.email}<p id="cf-email-err" class="err">{errors.email}</p>{/if}
		</div>
	</div>
	<div>
		<label for="cf-message" class="label">Message</label>
		<textarea
			id="cf-message"
			name="message"
			rows="5"
			class="input resize-y"
			bind:value={message}
			aria-invalid={errors.message ? 'true' : undefined}
			aria-describedby={errors.message ? 'cf-message-err' : undefined}></textarea>
		{#if errors.message}<p id="cf-message-err" class="err">{errors.message}</p>{/if}
	</div>
	<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
		<p id="form-note" class="text-xs text-subtle">
			Opens your email app with this message — nothing is stored on this site.
		</p>
		<button type="submit" class="btn btn-primary">
			<Send size={16} aria-hidden="true" /> Compose email
		</button>
	</div>
	<p class="text-sm text-muted" role="status" aria-live="polite">
		{status}
		{#if composed}
			If nothing happened, <a class="text-accent underline" href={composed}>open the draft again</a> or write to
			<a class="text-accent underline" href="mailto:{profile.email}">{profile.email}</a>.
		{/if}
	</p>
</form>

<style>
	.label {
		display: block;
		margin-bottom: 0.4rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--fg);
	}
	.input {
		width: 100%;
		min-height: 2.75rem;
		padding: 0.6rem 0.85rem;
		border-radius: 0.7rem;
		font-size: 0.9375rem;
		color: var(--fg);
		background: var(--bg);
		border: 1px solid var(--line-strong);
		transition:
			border-color 150ms ease,
			box-shadow 150ms ease;
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
		margin-top: 0.35rem;
		font-size: 0.8125rem;
		color: #f87171;
	}
	:global([data-theme='light']) .err {
		color: #b91c1c;
	}
	:global([data-theme='light']) .input[aria-invalid='true'] {
		border-color: #b91c1c;
	}
</style>
