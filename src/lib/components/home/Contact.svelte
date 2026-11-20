<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import Copy from '@lucide/svelte/icons/copy';
	import Mail from '@lucide/svelte/icons/mail';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import { reveal } from '#lib/actions/reveal.ts';
	import BrandIcon from '#lib/components/ui/BrandIcon.svelte';
	import SectionHeading from '#lib/components/ui/SectionHeading.svelte';
	import { profile } from '#lib/content/profile.ts';
	import ContactForm from './ContactForm.svelte';

	let copied = $state(false);
	let canCopy = $state(false);
	$effect(() => {
		canCopy = typeof navigator !== 'undefined' && !!navigator.clipboard;
	});

	async function copyEmail() {
		try {
			await navigator.clipboard.writeText(profile.email);
			copied = true;
			setTimeout(() => (copied = false), 2200);
		} catch {
			copied = false;
		}
	}

	const channels = $derived(
		[
			{ label: 'GitHub · AI/ML work', href: profile.links.github, handle: 'phanphounkh', icon: 'github' as const },
			{ label: 'GitHub · Web projects', href: profile.links.githubWeb, handle: 'phanphoun', icon: 'github' as const },
			profile.links.linkedin
				? { label: 'LinkedIn', href: profile.links.linkedin, handle: 'LinkedIn profile', icon: 'linkedin' as const }
				: null
		].filter((c) => c !== null)
	);
</script>

<section id="contact" class="section bg-bg-2" aria-labelledby="contact-title">
	<div class="container-x">
		<div class="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
			<div>
				<SectionHeading
					id="contact"
					index="08"
					eyebrow="Contact"
					title="Let's build something useful together."
					intro="I'm interested in junior AI/ML, computer vision and Python roles, research assistant positions and internships. The fastest way to reach me is email."
				/>

				<div class="card mt-8 p-5" use:reveal>
					<p class="text-xs font-medium tracking-wide text-subtle uppercase">Email</p>
					<div class="mt-2 flex flex-wrap items-center gap-3">
						<a
							href="mailto:{profile.email}"
							class="inline-flex items-center gap-2 text-lg font-medium break-all text-fg hover:text-accent"
						>
							<Mail size={18} aria-hidden="true" class="flex-none" />{profile.email}
						</a>
						{#if canCopy}
							<button type="button" class="btn btn-ghost btn-sm" onclick={copyEmail} aria-label="Copy email address">
								{#if copied}<Check size={15} aria-hidden="true" /> Copied{:else}<Copy size={15} aria-hidden="true" /> Copy{/if}
							</button>
						{/if}
					</div>
					<span class="sr-only" role="status">{copied ? 'Email address copied' : ''}</span>
				</div>

				<ul class="mt-4 space-y-3" use:reveal={80}>
					{#each channels as c (c.href)}
						<li>
							<a href={c.href} target="_blank" rel="me noopener" class="channel">
								<BrandIcon name={c.icon} size={18} />
								<span class="flex-1">
									<span class="block text-sm font-medium text-fg">{c.label}</span>
									<span class="block font-mono text-xs text-subtle">{c.handle}</span>
								</span>
								<span class="sr-only">(opens in a new tab)</span>
							</a>
						</li>
					{/each}
					<li class="flex items-center gap-3 px-4 py-2 text-sm text-muted">
						<MapPin size={18} aria-hidden="true" />{profile.location} · UTC+7
					</li>
				</ul>
			</div>

			<div use:reveal={120}>
				<ContactForm />
			</div>
		</div>
	</div>
</section>

<style>
	.channel {
		display: flex;
		align-items: center;
		gap: 0.9rem;
		padding: 0.85rem 1rem;
		border-radius: 0.9rem;
		color: var(--muted);
		border: 1px solid var(--line);
		background: var(--surface);
		transition:
			border-color 150ms ease,
			color 150ms ease,
			transform 200ms var(--ease-out-soft);
	}
	.channel:hover {
		color: var(--fg);
		border-color: var(--line-strong);
		transform: translateX(2px);
	}
</style>
