<script lang="ts">
	// 1200×630 social card. Rendered to static/og.png by `npm run cv`; not linked anywhere.
	import { profile } from '#lib/content/profile.ts';
</script>

<svelte:head>
	<title>Social card — {profile.name}</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="og">
	<div class="grid-bg absolute inset-0 opacity-70"></div>
	<div class="glow"></div>
	<div class="relative flex h-full items-center gap-16 px-20">
		<div class="flex-1">
			<p class="font-mono text-[22px] tracking-[0.16em] text-[#34d5ee] uppercase">
				AI/ML Engineer · Computer Vision &amp; OCR
			</p>
			<h1 class="mt-6 text-[96px] leading-none font-semibold tracking-[-0.045em] text-white uppercase">
				{profile.name}
			</h1>
			<p class="mt-8 max-w-[660px] text-[34px] leading-tight tracking-[-0.02em] text-balance text-[#c9d3e5]">
				Building Intelligent Solutions with AI &amp; Code.
			</p>
			<p class="mt-10 font-mono text-[22px] text-[#8b97ae]">camdev.site · Phnom Penh, Cambodia</p>
		</div>
		<div class="photo">
			<img src="/images/portrait-560.jpg" alt="" width="560" height="700" />
		</div>
	</div>
</div>

<style>
	:global(body:has(.og)) {
		margin: 0;
		background: #060912;
	}
	.og {
		position: relative;
		width: 1200px;
		height: 630px;
		overflow: hidden;
		background: #060912;
		--grid: rgb(148 163 184 / 0.07);
	}
	.glow {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(40% 60% at 85% 10%, rgb(59 130 246 / 0.35), transparent 70%),
			radial-gradient(35% 50% at 10% 100%, rgb(34 211 238 / 0.2), transparent 70%);
	}
	.photo {
		position: relative;
		width: 330px;
		height: 412px;
		flex: none;
		border-radius: 28px;
		padding: 2px;
		background: linear-gradient(150deg, #5b97ff, rgb(148 163 184 / 0.2) 40%, #34d5ee);
	}
	.photo img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 26px;
	}
</style>
