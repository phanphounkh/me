<script lang="ts">
	import { onMount, tick } from 'svelte';
	import Mail from '@lucide/svelte/icons/mail';
	import MessageCircle from '@lucide/svelte/icons/message-circle';
	import Phone from '@lucide/svelte/icons/phone';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import X from '@lucide/svelte/icons/x';
	import AiChat, { type ChatMode } from './AiChat.svelte';
	import QuickCall from './QuickCall.svelte';
	import QuickEmail from './QuickEmail.svelte';

	/**
	 * Floating contact assistant: Ask AI (Gemini + RAG over the portfolio), quick email and quick call.
	 * Rendered only after hydration, so there is never a dead button when JavaScript is off.
	 * The panel is created on first open and then stays mounted, so the conversation and email
	 * draft survive closing it.
	 */
	type Tab = 'ai' | 'email' | 'call';
	const tabs = [
		{ id: 'ai', label: 'Ask AI', icon: Sparkles },
		{ id: 'email', label: 'Email', icon: Mail },
		{ id: 'call', label: 'Call', icon: Phone }
	] as const;

	let mounted = $state(false);
	let open = $state(false);
	let used = $state(false);
	let active = $state<Tab>('ai');
	let mode = $state<ChatMode>(null);
	let launcher = $state<HTMLButtonElement>();
	let panel = $state<HTMLElement>();

	onMount(() => (mounted = true));

	async function focusActive() {
		await tick();
		panel?.querySelector<HTMLElement>(`#chat-panel-${active} [data-autofocus]`)?.focus();
	}

	async function toggle() {
		if (!used) {
			used = true;
			await tick();
			panel?.getBoundingClientRect(); // commit the closed state first, so the opening transition runs
		}
		open = !open;
		if (open) focusActive();
	}

	function close() {
		open = false;
		launcher?.focus();
	}

	function select(id: Tab, focusTab = false) {
		active = id;
		if (focusTab) document.getElementById(`chat-tab-${id}`)?.focus();
	}

	function onTabKey(event: KeyboardEvent) {
		const i = tabs.findIndex((t) => t.id === active);
		const next =
			event.key === 'ArrowRight'
				? (i + 1) % tabs.length
				: event.key === 'ArrowLeft'
					? (i - 1 + tabs.length) % tabs.length
					: event.key === 'Home'
						? 0
						: event.key === 'End'
							? tabs.length - 1
							: -1;
		if (next < 0) return;
		event.preventDefault();
		select(tabs[next]!.id, true);
	}

	function onPanelKey(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			event.stopPropagation();
			close();
		}
	}

	/** Following a site link from the panel on a small screen: get out of the way. */
	function onPanelClick(event: MouseEvent) {
		const a = (event.target as HTMLElement).closest('a');
		if (a?.getAttribute('href')?.startsWith('/') && window.matchMedia('(max-width: 639px)').matches) open = false;
	}

	const status = $derived(
		mode === 'fallback'
			? { text: 'Offline mode · portfolio excerpts', live: false }
			: { text: mode === 'ai' ? 'Online · powered by Gemini' : 'Online · answers from the portfolio', live: true }
	);
</script>

{#if used}
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<section
		bind:this={panel}
		id="chat-panel"
		class="panel"
		class:open
		inert={!open}
		aria-labelledby="chat-title"
		onkeydown={onPanelKey}
		onclick={onPanelClick}
	>
		<header class="head">
			<span class="avatar" aria-hidden="true"><Sparkles size={18} /></span>
			<div class="min-w-0 flex-1">
				<h2 id="chat-title" class="text-sm font-semibold text-fg">Phoun's Assistant</h2>
				<p class="status" class:offline={!status.live}>
					<span class="dot" aria-hidden="true"></span>{status.text}
				</p>
			</div>
			<button type="button" class="close" onclick={close} aria-label="Close chat">
				<X size={18} aria-hidden="true" />
			</button>
		</header>

		<div class="tabs" role="tablist" aria-label="Ways to reach Phoun" tabindex="-1" onkeydown={onTabKey}>
			{#each tabs as t (t.id)}
				<button
					type="button"
					role="tab"
					id="chat-tab-{t.id}"
					class="tab"
					aria-selected={active === t.id}
					aria-controls="chat-panel-{t.id}"
					tabindex={active === t.id ? 0 : -1}
					onclick={() => select(t.id)}
				>
					<t.icon size={15} aria-hidden="true" />{t.label}
				</button>
			{/each}
		</div>

		{#each tabs as t (t.id)}
			<div
				id="chat-panel-{t.id}"
				role="tabpanel"
				aria-labelledby="chat-tab-{t.id}"
				class="body"
				hidden={active !== t.id}
			>
				{#if t.id === 'ai'}
					<AiChat bind:mode onswitch={(tab) => select(tab)} />
				{:else if t.id === 'email'}
					<QuickEmail />
				{:else}
					<QuickCall />
				{/if}
			</div>
		{/each}
	</section>
{/if}

{#if mounted}
	<button
		bind:this={launcher}
		type="button"
		class="launcher"
		class:open
		onclick={toggle}
		aria-expanded={open}
		aria-controls={used ? 'chat-panel' : undefined}
		aria-label={open ? 'Close chat' : 'Chat with Phoun’s assistant'}
	>
		{#if open}<X size={22} aria-hidden="true" />{:else}<MessageCircle size={22} aria-hidden="true" />{/if}
	</button>
{/if}

<style>
	.launcher {
		position: fixed;
		right: 1rem;
		bottom: 1rem;
		z-index: 46;
		display: grid;
		place-items: center;
		width: 3.5rem;
		height: 3.5rem;
		border-radius: 999px;
		color: var(--btn-fg);
		background: linear-gradient(135deg, var(--btn-bg), color-mix(in srgb, var(--btn-bg) 55%, var(--accent-2)));
		box-shadow:
			0 0 0 1px rgb(255 255 255 / 0.1) inset,
			0 14px 34px -10px var(--glow-1);
		transition:
			transform 200ms var(--ease-out-soft),
			box-shadow 200ms ease;
	}
	.launcher:hover {
		transform: translateY(-2px);
	}
	.launcher:active {
		transform: translateY(0);
	}

	.panel {
		position: fixed;
		right: 0.75rem;
		left: 0.75rem;
		bottom: 5.25rem;
		z-index: 45;
		display: flex;
		flex-direction: column;
		height: min(40rem, calc(100dvh - 6.5rem));
		border-radius: 1.25rem;
		overflow: hidden;
		background: var(--surface-strong);
		border: 1px solid var(--line-strong);
		box-shadow:
			var(--shadow),
			0 30px 80px -30px rgb(0 0 0 / 0.55);
		opacity: 0;
		visibility: hidden;
		transform: translateY(12px) scale(0.98);
		transform-origin: bottom right;
		transition:
			opacity 180ms ease,
			transform 220ms var(--ease-out-soft),
			visibility 0s linear 220ms;
	}
	.panel.open {
		opacity: 1;
		visibility: visible;
		transform: none;
		transition:
			opacity 180ms ease,
			transform 220ms var(--ease-out-soft),
			visibility 0s;
	}
	@media (min-width: 640px) {
		.launcher {
			right: 1.5rem;
			bottom: 1.5rem;
		}
		.panel {
			left: auto;
			right: 1.5rem;
			bottom: 5.75rem;
			width: 24rem;
		}
	}

	.head {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.9rem 0.9rem 0.9rem 1rem;
		border-bottom: 1px solid var(--line);
		background: linear-gradient(180deg, var(--accent-soft), transparent);
	}
	.avatar {
		display: grid;
		place-items: center;
		flex: none;
		width: 2.25rem;
		height: 2.25rem;
		border-radius: 0.75rem;
		color: #fff;
		background: linear-gradient(135deg, var(--btn-bg), color-mix(in srgb, var(--btn-bg) 50%, var(--accent-2)));
	}
	.status {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		margin-top: 0.1rem;
		font-size: 0.75rem;
		color: var(--muted);
	}
	.dot {
		width: 0.45rem;
		height: 0.45rem;
		border-radius: 999px;
		background: var(--s-completed);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--s-completed) 22%, transparent);
	}
	.status.offline .dot {
		background: var(--s-learning);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--s-learning) 22%, transparent);
	}
	.close {
		display: grid;
		place-items: center;
		width: 2.25rem;
		height: 2.25rem;
		border-radius: 0.6rem;
		color: var(--muted);
	}
	.close:hover {
		color: var(--fg);
		background: var(--surface-hover);
	}

	.tabs {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.25rem;
		margin: 0.75rem 0.9rem 0;
		padding: 0.25rem;
		border-radius: 0.8rem;
		background: var(--bg);
		border: 1px solid var(--line);
	}
	.tab {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		min-height: 2.25rem;
		border-radius: 0.6rem;
		font-size: 0.8125rem;
		font-weight: 550;
		color: var(--muted);
		transition:
			color 150ms ease,
			background-color 150ms ease;
	}
	.tab:hover {
		color: var(--fg);
	}
	.tab[aria-selected='true'] {
		color: var(--fg);
		background: var(--surface-strong);
		box-shadow:
			0 0 0 1px var(--line-strong),
			0 4px 12px -6px rgb(0 0 0 / 0.4);
	}

	.body {
		display: flex;
		flex: 1;
		flex-direction: column;
		min-height: 0;
	}
	.body[hidden] {
		display: none;
	}

	@media print {
		.launcher,
		.panel {
			display: none;
		}
	}
</style>
