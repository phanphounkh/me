<script lang="ts">
	/**
	 * Illustrative SVG covers for projects without public screenshots.
	 * They depict the idea of each project — they are never presented as screenshots.
	 */
	import type { CoverMotif } from '#lib/content/types.ts';

	let { motif, class: className = '' }: { motif: CoverMotif; class?: string } = $props();
	const uid = $props.id();

	// Deterministic "glyph" widths for text lines.
	const rows = [
		[16, 9, 22, 7, 28, 12, 10],
		[24, 11, 8, 30, 14, 9],
		[12, 26, 9, 18, 22, 8, 6],
		[20, 8, 15, 27, 10, 13],
		[9, 22, 16, 11, 25, 12],
		[28, 10, 19, 8, 14]
	];
	function glyphs(widths: number[], x0: number) {
		let x = x0;
		return widths.map((w) => {
			const g = { x, w };
			x += w + 4;
			return g;
		});
	}
	// Simple 9×9 QR-like pattern (decorative).
	const qr = Array.from({ length: 81 }, (_, i) => ((i * 7 + (i % 9) * 3 + Math.floor(i / 9) * 5) % 5 < 2 ? 1 : 0));
	const finder = (r: number, c: number) => (r < 3 && c < 3) || (r < 3 && c > 5) || (r > 5 && c < 3);
	const bars = [42, 58, 50, 71, 64, 83, 77, 92];
	const dots = [
		[44, 150],
		[58, 138],
		[70, 142],
		[84, 124],
		[97, 128],
		[110, 108],
		[122, 116],
		[136, 96],
		[150, 98],
		[162, 82],
		[176, 86],
		[190, 70]
	];
</script>

<svg
	viewBox="0 0 320 200"
	class="art {className}"
	role="img"
	aria-label="Illustration: {motif}"
	preserveAspectRatio="xMidYMid meet"
>
	<defs>
		<linearGradient id="{uid}-bg" x1="0" y1="0" x2="1" y2="1">
			<stop offset="0" stop-color="var(--surface-strong)" />
			<stop offset="1" stop-color="var(--bg-2)" />
		</linearGradient>
		<radialGradient id="{uid}-glow" cx="0.75" cy="0.15" r="0.8">
			<stop offset="0" stop-color="var(--accent)" stop-opacity="0.28" />
			<stop offset="1" stop-color="var(--accent)" stop-opacity="0" />
		</radialGradient>
		<pattern id="{uid}-grid" width="16" height="16" patternUnits="userSpaceOnUse">
			<path d="M16 0H0V16" fill="none" stroke="var(--grid)" stroke-width="1" />
		</pattern>
		<linearGradient id="{uid}-scan" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0" stop-color="var(--accent-2)" stop-opacity="0" />
			<stop offset="0.9" stop-color="var(--accent-2)" stop-opacity="0.22" />
			<stop offset="1" stop-color="var(--accent-2)" stop-opacity="0.7" />
		</linearGradient>
	</defs>
	<!-- Backgrounds extend far past the viewBox: with "meet" scaling the illustration is never
	     cropped, and these layers fill whatever extra space the container's aspect ratio leaves. -->
	<rect x="-480" y="-300" width="1280" height="800" fill="url(#{uid}-bg)" />
	<rect x="-480" y="-304" width="1280" height="800" fill="url(#{uid}-grid)" />
	<rect x="-160" y="-100" width="640" height="400" fill="url(#{uid}-glow)" />

	{#if motif === 'ocr'}
		<g>
			<rect x="92" y="18" width="136" height="168" rx="6" fill="var(--surface-strong)" stroke="var(--line-strong)" />
			{#each rows as row, r (r)}
				{#each glyphs(row, 106) as g, j (j)}
					<rect
						x={g.x}
						y={40 + r * 23}
						width={g.w}
						height="7"
						rx="2"
						fill="var(--muted)"
						opacity={0.35 + (j % 3) * 0.12}
					/>
					{#if j % 2 === 0}<rect
							x={g.x + 2}
							y={36 + r * 23}
							width="3"
							height="3"
							rx="1"
							fill="var(--muted)"
							opacity="0.45"
						/>{/if}
					{#if j % 3 === 1}<rect
							x={g.x + g.w - 5}
							y={49 + r * 23}
							width="3"
							height="3"
							rx="1"
							fill="var(--muted)"
							opacity="0.45"
						/>{/if}
				{/each}
			{/each}
			{#each [1, 2, 3] as r (r)}
				<rect
					x="100"
					y={31 + r * 23}
					width="120"
					height="22"
					rx="3"
					fill="none"
					stroke="var(--accent-2)"
					stroke-width="1.2"
					stroke-dasharray={r === 2 ? '0' : '4 3'}
				/>
				<rect
					x="229"
					y={34 + r * 23}
					width="38"
					height="12"
					rx="3"
					fill="var(--accent-2)"
					opacity={r === 2 ? 1 : 0.55}
				/>
				<text x="233" y={43 + r * 23} font-family="var(--font-mono)" font-size="7.5" fill="var(--bg)">
					line_0{r + 1}
				</text>
			{/each}
			<rect class="scan" x="92" y="18" width="136" height="56" fill="url(#{uid}-scan)" />
			<text x="24" y="182" font-family="var(--font-mono)" font-size="8" fill="var(--subtle)">page → lines → text</text>
		</g>
	{:else if motif === 'annotation'}
		<g>
			<rect x="20" y="22" width="104" height="156" rx="6" fill="var(--surface-strong)" stroke="var(--line-strong)" />
			{#each rows.slice(0, 5) as row, r (r)}
				{#each glyphs(row.slice(0, 4), 30) as g, j (j)}
					<rect x={g.x} y={44 + r * 26} width={Math.min(g.w, 22)} height="6" rx="2" fill="var(--muted)" opacity="0.4" />
				{/each}
			{/each}
			<rect
				x="26"
				y="88"
				width="92"
				height="20"
				rx="3"
				fill="var(--accent-soft)"
				stroke="var(--accent)"
				stroke-width="1.4"
			/>
			<path
				d="M118 98 C 140 98, 136 62, 150 62"
				fill="none"
				stroke="var(--accent)"
				stroke-width="1.2"
				stroke-dasharray="3 3"
			/>
			<rect x="150" y="34" width="150" height="52" rx="6" fill="var(--surface-strong)" stroke="var(--accent)" />
			<path
				d="M162 66 c6 -14 10 6 16 -4 s 8 -10 12 2 s 6 8 12 -6 s 10 4 14 -2 s 8 -8 12 4 s 6 6 12 -4 s 10 0 14 2 s 8 -6 14 0"
				fill="none"
				stroke="var(--fg)"
				stroke-width="2"
				stroke-linecap="round"
				opacity="0.8"
			/>
			<rect x="150" y="98" width="150" height="34" rx="6" fill="var(--surface)" stroke="var(--line-strong)" />
			<text x="160" y="120" font-family="var(--font-khmer)" font-size="13" fill="var(--fg)" lang="km">ខ្ញុំទៅសាលារៀន</text>
			<rect x="150" y="144" width="70" height="22" rx="11" fill="var(--accent-2-soft)" stroke="var(--accent-2)" />
			<text x="162" y="158.5" font-family="var(--font-mono)" font-size="8" fill="var(--accent-2)">✓ approved</text>
			<rect x="228" y="144" width="72" height="22" rx="11" fill="none" stroke="var(--line-strong)" />
			<text x="240" y="158.5" font-family="var(--font-mono)" font-size="8" fill="var(--subtle)">export →</text>
		</g>
	{:else if motif === 'cart'}
		<g>
			{#each [0, 1, 2] as i (i)}
				<rect
					x={20 + i * 62}
					y="30"
					width="54"
					height="72"
					rx="8"
					fill="var(--surface-strong)"
					stroke="var(--line-strong)"
				/>
				<circle cx={47 + i * 62} cy="58" r="16" fill="var(--accent-soft)" stroke="var(--accent)" stroke-opacity="0.5" />
				<circle cx={47 + i * 62} cy="58" r="8" fill="var(--accent-2)" opacity={0.25 + i * 0.2} />
				<rect x={28 + i * 62} y="82" width="30" height="5" rx="2" fill="var(--muted)" opacity="0.5" />
				<rect x={28 + i * 62} y="91" width="18" height="5" rx="2" fill="var(--accent)" opacity="0.7" />
			{/each}
			<rect x="20" y="114" width="178" height="66" rx="8" fill="var(--surface-strong)" stroke="var(--line-strong)" />
			{#each [0, 1] as i (i)}
				<rect x="32" y={128 + i * 16} width="70" height="6" rx="2" fill="var(--muted)" opacity="0.5" />
				<rect x="150" y={128 + i * 16} width="34" height="6" rx="2" fill="var(--muted)" opacity="0.5" />
			{/each}
			<line x1="32" y1="164" x2="184" y2="164" stroke="var(--line-strong)" />
			<rect x="150" y="168" width="34" height="6" rx="2" fill="var(--accent-2)" />
			<rect x="216" y="30" width="86" height="104" rx="10" fill="var(--surface-strong)" stroke="var(--accent-2)" />
			{#each qr as cell, i (i)}
				{@const r = Math.floor(i / 9)}
				{@const c = i % 9}
				{#if cell || finder(r, c)}
					<rect
						x={229 + c * 6.6}
						y={42 + r * 6.6}
						width="5.6"
						height="5.6"
						rx="1"
						fill="var(--fg)"
						opacity={finder(r, c) ? 0.9 : 0.6}
					/>
				{/if}
			{/each}
			<text x="230" y="122" font-family="var(--font-mono)" font-size="8" fill="var(--accent-2)">DEMO · KHQR</text>
			<text x="216" y="160" font-family="var(--font-mono)" font-size="8" fill="var(--subtle)">no real payment</text>
		</g>
	{:else if motif === 'pipeline'}
		<g>
			{#each ['upload', 'review', 'annotate', 'export'] as label, i (label)}
				<rect
					x={18 + i * 74}
					y="58"
					width="60"
					height="44"
					rx="8"
					fill="var(--surface-strong)"
					stroke={i === 0 ? 'var(--accent-2)' : 'var(--line-strong)'}
					stroke-dasharray={i === 0 ? '0' : '4 3'}
				/>
				<text
					x={48 + i * 74}
					y="84"
					text-anchor="middle"
					font-family="var(--font-mono)"
					font-size="8.5"
					fill={i === 0 ? 'var(--accent-2)' : 'var(--muted)'}
				>
					{label}
				</text>
				{#if i < 3}
					<path d="M{80 + i * 74} 80 h10" stroke="var(--line-strong)" stroke-width="1.5" />
					<path d="M{88 + i * 74} 76 l4 4 l-4 4" fill="none" stroke="var(--line-strong)" stroke-width="1.5" />
				{/if}
			{/each}
			<ellipse cx="160" cy="136" rx="34" ry="8" fill="var(--surface-strong)" stroke="var(--accent)" />
			<path d="M126 136 v22 a34 8 0 0 0 68 0 v-22" fill="var(--surface-strong)" stroke="var(--accent)" />
			<path d="M126 147 a34 8 0 0 0 68 0" fill="none" stroke="var(--accent)" opacity="0.5" />
			<path d="M160 102 v24" stroke="var(--line-strong)" stroke-dasharray="3 3" />
			<text x="18" y="34" font-family="var(--font-mono)" font-size="8" fill="var(--subtle)">
				foundation ✓ · features in progress
			</text>
		</g>
	{:else if motif === 'api'}
		<g>
			<rect x="18" y="26" width="170" height="148" rx="8" fill="var(--surface-strong)" stroke="var(--line-strong)" />
			<circle cx="30" cy="38" r="3" fill="var(--line-strong)" />
			<circle cx="40" cy="38" r="3" fill="var(--line-strong)" />
			<circle cx="50" cy="38" r="3" fill="var(--line-strong)" />
			{#each [['GET', '/tasks', '200'], ['POST', '/tasks', '201'], ['GET', '/tasks/7', '200'], ['PATCH', '/tasks/7', '200'], ['GET', '/tasks/analytics', '200'], ['DELETE', '/tasks/7', '204']] as [m, p, s], i (i)}
				<text
					x="30"
					y={66 + i * 18}
					font-family="var(--font-mono)"
					font-size="8.5"
					fill={m === 'GET' ? 'var(--accent-2)' : 'var(--accent)'}
				>
					{m}
				</text>
				<text x="70" y={66 + i * 18} font-family="var(--font-mono)" font-size="8.5" fill="var(--muted)">{p}</text>
				<text x="160" y={66 + i * 18} font-family="var(--font-mono)" font-size="8.5" fill="var(--s-completed)">
					{s}
				</text>
			{/each}
			{#each ['router', 'service', 'repository'] as layer, i (layer)}
				<rect
					x="206"
					y={46 + i * 42}
					width="96"
					height="30"
					rx="7"
					fill="var(--surface-strong)"
					stroke={i === 1 ? 'var(--accent)' : 'var(--line-strong)'}
				/>
				<text
					x="254"
					y={65 + i * 42}
					text-anchor="middle"
					font-family="var(--font-mono)"
					font-size="8.5"
					fill="var(--fg)"
				>
					{layer}
				</text>
				{#if i < 2}<path d="M254 {76 + i * 42} v12" stroke="var(--line-strong)" stroke-width="1.5" />{/if}
			{/each}
		</g>
	{:else if motif === 'chart'}
		<g>
			<line x1="34" y1="166" x2="300" y2="166" stroke="var(--line-strong)" />
			<line x1="34" y1="24" x2="34" y2="166" stroke="var(--line-strong)" />
			{#each bars as b, i (i)}
				<rect
					x={214 + i * 10}
					y={166 - b}
					width="7"
					height={b}
					rx="1.5"
					fill="var(--accent)"
					opacity={0.35 + i * 0.07}
				/>
			{/each}
			{#each dots as [x, y], i (i)}
				<circle cx={x} cy={y} r="3.2" fill="var(--accent-2)" opacity="0.85" />
			{/each}
			<path d="M40 156 L196 66" stroke="var(--fg)" stroke-width="1.4" stroke-dasharray="5 4" opacity="0.7" />
			<text x="42" y="40" font-family="var(--font-mono)" font-size="8" fill="var(--subtle)">score ~ study_time</text>
			<text x="214" y="40" font-family="var(--font-mono)" font-size="8" fill="var(--subtle)">distribution</text>
		</g>
	{:else}
		<g>
			{#each Array.from({ length: 6 }) as _, i (i)}
				<path
					d="M{60 + i * 34} {150 - (i % 3) * 18} l30 -17 l30 17 l-30 17 z"
					fill="var(--accent-soft)"
					stroke="var(--accent)"
					stroke-opacity="0.4"
				/>
			{/each}
		</g>
	{/if}
</svg>

<style>
	.art {
		display: block;
		width: 100%;
		height: 100%;
	}
	/* SVG animations run on the main thread, so the scan only sweeps while the card is
	   hovered or focused; at rest it sits still over the detected lines. */
	.scan {
		transform: translateY(40px);
		opacity: 0.7;
	}
	:global(.pcard:hover) .scan,
	:global(.pcard:focus-within) .scan {
		animation: sweep 2.6s cubic-bezier(0.45, 0, 0.2, 1) infinite;
	}
	@keyframes sweep {
		0% {
			transform: translateY(0);
			opacity: 0;
		}
		10% {
			opacity: 1;
		}
		70% {
			transform: translateY(112px);
			opacity: 1;
		}
		80%,
		100% {
			transform: translateY(112px);
			opacity: 0;
		}
	}
</style>
