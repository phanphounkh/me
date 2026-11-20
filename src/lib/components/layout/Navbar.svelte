<script lang="ts">
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	import Menu from '@lucide/svelte/icons/menu';
	import X from '@lucide/svelte/icons/x';
	import Download from '@lucide/svelte/icons/download';
	import { navItems, sectionHref } from '#lib/config/nav.ts';
	import { CV_PDF_PATH } from '#lib/content/profile.ts';
	import Logo from './Logo.svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	let open = $state(false);
	let scrolled = $state(false);
	let active = $state<string | null>(null);
	let menuButton = $state<HTMLButtonElement>();
	let panel = $state<HTMLDivElement>();

	const isHome = $derived(page.url.pathname === '/');

	function close(returnFocus = false) {
		open = false;
		if (returnFocus) menuButton?.focus();
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && open) close(true);
	}

	afterNavigate(() => close());

	// Scroll state for the bar background.
	$effect(() => {
		const onScroll = () => (scrolled = window.scrollY > 8);
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	// Scrollspy: highlight the section in the middle of the viewport (home page only).
	$effect(() => {
		if (!isHome) {
			active = null;
			return;
		}
		const sections = navItems
			.map((item) => document.getElementById(item.id))
			.filter((el): el is HTMLElement => el !== null);
		const io = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) if (entry.isIntersecting) active = entry.target.id;
			},
			{ rootMargin: '-45% 0px -50% 0px' }
		);
		sections.forEach((s) => io.observe(s));
		return () => io.disconnect();
	});

	// Lock page scroll and move focus into the menu while it is open.
	$effect(() => {
		if (!open) return;
		const previous = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		panel?.querySelector<HTMLElement>('a, button')?.focus();
		return () => {
			document.body.style.overflow = previous;
		};
	});
</script>

<svelte:window onkeydown={onKeydown} />

<header class="bar" class:scrolled={scrolled || open}>
	<nav class="container-x flex h-16 items-center justify-between gap-4" aria-label="Main">
		<Logo />

		<ul class="hidden items-center gap-0.5 lg:flex">
			{#each navItems.filter((i) => i.desktop) as item (item.id)}
				<li>
					<a href={sectionHref(item.id)} class="nav-link" aria-current={active === item.id ? 'true' : undefined}>
						{item.label}
					</a>
				</li>
			{/each}
		</ul>

		<div class="flex items-center gap-2">
			<ThemeToggle />
			<a href={sectionHref('resume')} class="btn btn-primary btn-sm hidden sm:inline-flex">Resume</a>
			<button
				bind:this={menuButton}
				type="button"
				class="icon-btn lg:hidden"
				aria-expanded={open}
				aria-controls="mobile-menu"
				aria-label={open ? 'Close menu' : 'Open menu'}
				onclick={() => (open = !open)}
			>
				{#if open}<X size={20} aria-hidden="true" />{:else}<Menu size={20} aria-hidden="true" />{/if}
			</button>
		</div>
	</nav>

	<div bind:this={panel} id="mobile-menu" class="mobile-panel lg:hidden" class:open inert={!open} aria-hidden={!open}>
		<!-- The clipping wrapper has no padding, so the closed panel collapses to zero height. -->
		<div class="panel-clip">
			<ul class="container-x flex flex-col gap-1 pt-2 pb-6">
				{#each navItems as item, i (item.id)}
					<li style="--i: {i}">
						<a href={sectionHref(item.id)} class="mobile-link" onclick={() => close()}>
							<span class="font-mono text-xs text-subtle" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
							{item.label}
						</a>
					</li>
				{/each}
				<li class="mt-3" style="--i: {navItems.length}">
					<a href={CV_PDF_PATH} class="btn btn-primary w-full" download onclick={() => close()}>
						<Download size={18} aria-hidden="true" /> Download CV (PDF)
					</a>
				</li>
			</ul>
		</div>
	</div>
</header>

<style>
	.bar {
		position: sticky;
		top: 0;
		z-index: 50;
		border-bottom: 1px solid transparent;
		transition:
			background-color 200ms ease,
			border-color 200ms ease,
			backdrop-filter 200ms ease;
	}
	.bar.scrolled {
		background: color-mix(in srgb, var(--bg) 78%, transparent);
		backdrop-filter: blur(14px) saturate(140%);
		-webkit-backdrop-filter: blur(14px) saturate(140%);
		border-bottom-color: var(--line);
	}
	.nav-link {
		position: relative;
		display: inline-flex;
		padding: 0.5rem 0.75rem;
		border-radius: 0.6rem;
		font-size: 0.875rem;
		color: var(--muted);
		transition:
			color 150ms ease,
			background-color 150ms ease;
	}
	.nav-link:hover {
		color: var(--fg);
		background: var(--surface-hover);
	}
	.nav-link[aria-current='true'] {
		color: var(--fg);
	}
	.nav-link[aria-current='true']::after {
		content: '';
		position: absolute;
		left: 0.75rem;
		right: 0.75rem;
		bottom: 0.2rem;
		height: 1.5px;
		border-radius: 2px;
		background: linear-gradient(90deg, var(--accent), var(--accent-2));
	}
	.mobile-panel {
		display: grid;
		grid-template-rows: 0fr;
		transition: grid-template-rows 280ms var(--ease-out-soft);
	}
	/* Scoped CSS outranks Tailwind's lg:hidden, so hide the panel on desktop explicitly. */
	@media (min-width: 1024px) {
		.mobile-panel {
			display: none;
		}
	}
	.panel-clip {
		overflow: hidden;
		min-height: 0;
	}
	.mobile-panel.open {
		grid-template-rows: 1fr;
		height: calc(100dvh - 4rem);
		overflow-y: auto;
		border-bottom: 1px solid var(--line);
		background: color-mix(in srgb, var(--bg) 94%, transparent);
		backdrop-filter: blur(14px);
		-webkit-backdrop-filter: blur(14px);
	}
	.mobile-panel li {
		opacity: 0;
		transform: translateY(-6px);
		transition:
			opacity 240ms ease,
			transform 240ms var(--ease-out-soft);
		transition-delay: calc(var(--i) * 30ms);
	}
	.mobile-panel.open li {
		opacity: 1;
		transform: none;
	}
	.mobile-link {
		display: flex;
		align-items: baseline;
		gap: 0.875rem;
		padding: 0.875rem 0.25rem;
		font-size: 1.25rem;
		font-weight: 500;
		letter-spacing: -0.02em;
		color: var(--fg);
		border-bottom: 1px solid var(--line);
	}
	.mobile-link:hover {
		color: var(--accent);
	}
</style>
