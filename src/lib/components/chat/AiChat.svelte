<script lang="ts" module>
	/** "ai" when Gemini answered, "fallback" for rule-based answers, null before the first reply. */
	export type ChatMode = 'ai' | 'fallback' | null;
</script>

<script lang="ts">
	import { tick } from 'svelte';
	import ArrowUp from '@lucide/svelte/icons/arrow-up';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import Square from '@lucide/svelte/icons/square';
	import { formatMessage } from './format.ts';

	let { mode = $bindable(null), onswitch }: { mode?: ChatMode; onswitch: (tab: 'email' | 'call') => void } = $props();

	interface Message {
		id: number;
		role: 'user' | 'assistant';
		content: string;
		sources?: { title: string; href: string }[];
		mode?: ChatMode;
		error?: boolean;
		pending?: boolean;
	}

	const MAX_CHARS = 600;
	const suggestions = [
		'What is Phoun working on now?',
		'Tell me about his Khmer OCR research',
		'What are his strongest skills?',
		'How can I hire him?'
	];

	let nextId = 1;
	let messages = $state<Message[]>([]);
	let input = $state('');
	let busy = $state(false);
	let controller: AbortController | null = null;
	let log = $state<HTMLElement>();

	async function scrollDown(force = false) {
		await tick();
		if (!log) return;
		const nearBottom = log.scrollHeight - log.scrollTop - log.clientHeight < 120;
		if (force || nearBottom) log.scrollTop = log.scrollHeight;
	}

	async function ask(text: string, resend = false) {
		const question = text.trim().slice(0, MAX_CHARS);
		if (!question || busy) return;
		if (!resend) messages.push({ id: nextId++, role: 'user', content: question });
		input = '';

		const history = messages
			.filter((m) => !m.error && m.content)
			.slice(-10)
			.map(({ role, content }) => ({ role, content }));
		messages.push({ id: nextId++, role: 'assistant', content: '', pending: true });
		const reply = messages.at(-1)!; // the reactive proxy, so streamed updates re-render
		busy = true;
		controller = new AbortController();
		scrollDown(true);

		try {
			const res = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ messages: history }),
				signal: controller.signal
			});
			if (!res.ok || !res.body) {
				const data = await res.json().catch(() => null);
				throw new Error(data?.message ?? 'The assistant is unavailable right now.');
			}
			reply.mode = mode = res.headers.get('x-chat-mode') === 'ai' ? 'ai' : 'fallback';
			try {
				reply.sources = JSON.parse(decodeURIComponent(res.headers.get('x-chat-sources') ?? '[]'));
			} catch {
				reply.sources = [];
			}
			const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
			for (;;) {
				const { done, value } = await reader.read();
				if (done) break;
				reply.content += value;
				reply.pending = false;
				scrollDown();
			}
			if (!reply.content.trim()) throw new Error('The assistant returned an empty answer.');
		} catch (e) {
			if ((e as Error).name === 'AbortError') {
				if (!reply.content) reply.content = '(Stopped.)';
			} else if (!reply.content) {
				reply.error = true;
				reply.content =
					e instanceof TypeError
						? "I couldn't reach the server. Check your connection and try again."
						: (e as Error).message;
			}
		} finally {
			reply.pending = false;
			busy = false;
			controller = null;
			scrollDown();
		}
	}

	function retry(index: number) {
		const question = messages.slice(0, index).findLast((m) => m.role === 'user')?.content;
		messages.splice(index, 1);
		if (question) ask(question, true);
	}

	function onsubmit(event: SubmitEvent) {
		event.preventDefault();
		ask(input);
	}

	function onkeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
			event.preventDefault();
			ask(input);
		}
	}
</script>

<div class="log" bind:this={log} role="log" aria-live="polite" aria-busy={busy} aria-label="Conversation">
	<div class="msg assistant">
		<div class="bubble">
			<p>
				Hi! 👋 I'm Phoun's AI assistant. Ask me about his skills, projects, Khmer OCR research or experience — I answer
				from his portfolio.
			</p>
		</div>
	</div>

	{#if messages.length === 0}
		<div class="suggestions" aria-label="Suggested questions" role="group">
			{#each suggestions as s (s)}
				<button type="button" class="suggestion" onclick={() => ask(s)}>{s}</button>
			{/each}
		</div>
	{/if}

	{#each messages as m, i (m.id)}
		<div class="msg {m.role}" class:error={m.error}>
			<div class="bubble">
				{#if m.pending}
					<span class="typing" aria-label="Assistant is typing"><span></span><span></span><span></span></span>
				{:else if m.role === 'user'}
					<p>{m.content}</p>
				{:else}
					<!-- formatMessage escapes all text and only emits a fixed set of safe tags. -->
					{@html formatMessage(m.content)}
				{/if}
			</div>
			{#if m.error}
				<div class="meta">
					<button type="button" class="meta-btn" onclick={() => retry(i)} disabled={busy}>
						<RotateCcw size={13} aria-hidden="true" /> Try again
					</button>
					<span>or</span>
					<button type="button" class="meta-btn" onclick={() => onswitch('email')}>email Phoun</button>
				</div>
			{:else if m.role === 'assistant' && !m.pending}
				{#if m.mode === 'fallback'}
					<p class="meta">Offline answer — straight from the portfolio.</p>
				{/if}
				{#if m.sources?.length}
					<div class="sources">
						<span class="sr-only">Sources:</span>
						{#each m.sources as s (s.href + s.title)}
							<a href={s.href} class="source">{s.title}</a>
						{/each}
					</div>
				{/if}
			{/if}
		</div>
	{/each}
</div>

<form class="composer" {onsubmit}>
	<label for="chat-input" class="sr-only">Ask about Phoun</label>
	<textarea
		id="chat-input"
		data-autofocus
		rows="1"
		maxlength={MAX_CHARS}
		placeholder="Ask anything about Phoun…"
		bind:value={input}
		{onkeydown}></textarea>
	{#if busy}
		<button type="button" class="send" onclick={() => controller?.abort()} aria-label="Stop answer">
			<Square size={14} aria-hidden="true" fill="currentColor" />
		</button>
	{:else}
		<button type="submit" class="send" disabled={!input.trim()} aria-label="Send message">
			<ArrowUp size={18} aria-hidden="true" />
		</button>
	{/if}
</form>
<p class="fineprint">AI answers can be wrong — confirm important details with Phoun.</p>

<style>
	.log {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		overscroll-behavior: contain;
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
		padding: 1rem 0.9rem;
	}
	.msg {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		max-width: 88%;
	}
	.msg.user {
		align-self: flex-end;
		align-items: flex-end;
	}
	.bubble {
		padding: 0.6rem 0.85rem;
		border-radius: 1rem;
		font-size: 0.875rem;
		line-height: 1.55;
		overflow-wrap: anywhere;
	}
	.assistant .bubble {
		color: var(--fg);
		background: var(--surface);
		border: 1px solid var(--line);
		border-bottom-left-radius: 0.35rem;
	}
	.user .bubble {
		color: var(--btn-fg);
		background: var(--btn-bg);
		border-bottom-right-radius: 0.35rem;
		white-space: pre-wrap;
	}
	.error .bubble {
		border-color: color-mix(in srgb, #f87171 45%, transparent);
	}
	.bubble :global(p + p),
	.bubble :global(p + ul),
	.bubble :global(p + ol),
	.bubble :global(ul + p),
	.bubble :global(ol + p) {
		margin-top: 0.5rem;
	}
	.bubble :global(ul),
	.bubble :global(ol) {
		padding-left: 1.1rem;
	}
	.bubble :global(ul) {
		list-style: disc;
	}
	.bubble :global(ol) {
		list-style: decimal;
	}
	.bubble :global(li + li) {
		margin-top: 0.2rem;
	}
	.bubble :global(strong) {
		font-weight: 600;
	}
	.bubble :global(a) {
		color: var(--accent);
		text-decoration: underline;
		text-underline-offset: 2px;
	}
	.bubble :global(code) {
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		padding: 0.05rem 0.3rem;
		border-radius: 0.3rem;
		background: var(--accent-soft);
	}

	.typing {
		display: inline-flex;
		gap: 0.25rem;
		padding-block: 0.35rem;
	}
	.typing span {
		width: 0.4rem;
		height: 0.4rem;
		border-radius: 999px;
		background: var(--subtle);
		animation: blink 1.2s infinite ease-in-out;
	}
	.typing span:nth-child(2) {
		animation-delay: 0.15s;
	}
	.typing span:nth-child(3) {
		animation-delay: 0.3s;
	}
	@keyframes blink {
		0%,
		80%,
		100% {
			opacity: 0.25;
		}
		40% {
			opacity: 1;
		}
	}

	.meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.75rem;
		color: var(--subtle);
	}
	.meta-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		color: var(--accent);
		font-weight: 500;
	}
	.meta-btn:hover {
		text-decoration: underline;
	}
	.meta-btn:disabled {
		opacity: 0.5;
	}
	.sources {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
	}
	.source {
		padding: 0.15rem 0.55rem;
		border-radius: 999px;
		font-size: 0.75rem;
		color: var(--muted);
		border: 1px solid var(--line);
		background: var(--bg);
		transition:
			color 150ms ease,
			border-color 150ms ease;
	}
	.source:hover {
		color: var(--fg);
		border-color: var(--accent);
	}

	.suggestions {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.4rem;
	}
	.suggestion {
		padding: 0.45rem 0.8rem;
		border-radius: 999px;
		font-size: 0.8125rem;
		text-align: left;
		color: var(--fg);
		border: 1px solid var(--line-strong);
		background: var(--bg);
		transition:
			border-color 150ms ease,
			background-color 150ms ease;
	}
	.suggestion:hover {
		border-color: var(--accent);
		background: var(--accent-soft);
	}

	.composer {
		display: flex;
		align-items: flex-end;
		gap: 0.5rem;
		margin: 0 0.9rem;
		padding: 0.4rem 0.4rem 0.4rem 0.85rem;
		border-radius: 1rem;
		border: 1px solid var(--line-strong);
		background: var(--bg);
		transition:
			border-color 150ms ease,
			box-shadow 150ms ease;
	}
	.composer:focus-within {
		border-color: var(--accent);
		box-shadow: 0 0 0 3px var(--accent-soft);
	}
	textarea {
		flex: 1;
		min-height: 2.25rem;
		max-height: 7rem;
		padding: 0.45rem 0;
		resize: none;
		field-sizing: content;
		font-size: 0.9375rem;
		line-height: 1.4;
		color: var(--fg);
		background: transparent;
	}
	textarea::placeholder {
		color: var(--subtle);
	}
	textarea:focus-visible {
		outline: none;
	}
	.send {
		display: grid;
		place-items: center;
		flex: none;
		width: 2.25rem;
		height: 2.25rem;
		border-radius: 0.7rem;
		color: var(--btn-fg);
		background: var(--btn-bg);
		transition:
			background-color 150ms ease,
			opacity 150ms ease;
	}
	.send:hover:not(:disabled) {
		background: var(--btn-bg-hover);
	}
	.send:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
	.fineprint {
		padding: 0.45rem 0.9rem 0.7rem;
		font-size: 0.6875rem;
		text-align: center;
		color: var(--subtle);
	}
</style>
