/**
 * Generates optimized, responsive image variants from the originals in assets-src/.
 * Run with `npm run images` whenever a source image changes; outputs go to static/images/
 * and are committed so builds stay deterministic.
 *
 * To replace the portrait: overwrite assets-src/portrait/phoun-phan-original.png and adjust
 * the crop boxes below (left/top/width/height in source pixels), then run `npm run images`.
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const OUT = 'static/images';
const PORTRAIT_SRC = 'assets-src/portrait/phoun-phan-original.png';

// Crop boxes in source pixels (source is 1086×1448).
const HERO_CROP = { left: 263, top: 320, width: 560, height: 700 }; // 4:5 upper body
const SQUARE_CROP = { left: 330, top: 345, width: 420, height: 420 }; // head + shoulders

// Formal headshot used only on the CV (/cv/ and the PDF). Source is 965×1280.
const CV_PORTRAIT_SRC = 'assets-src/portrait/cv-portrait-original.png';
const CV_CROP = { left: 155, top: 0, width: 660, height: 660 }; // head + shoulders

// Hero slideshow (all cropped to 4:5). The studio slide is pre-processed by
// scripts/studio-backdrop.py (removes a baked-in checkerboard background).
const slides = [
	['assets-src/portrait/slide-studio.png', null, 'slide-studio'], // already 1086×1358 (4:5)
	['assets-src/portrait/slide-angkor-original.jpg', { left: 0, top: 170, width: 720, height: 900 }, 'slide-angkor'],
	['assets-src/portrait/slide-pnc-original.jpg', { left: 0, top: 30, width: 960, height: 1200 }, 'slide-pnc']
];

const projects = [
	['ppdw-wat-phnom-night', 'ppdw-cover'],
	['ppdw-phase3-two-players', 'ppdw-multiplayer'],
	['ppdw-phase4-shop-interior', 'ppdw-shop'],
	['ppdw-phase5-route', 'ppdw-route'],
	['ppdw-phase4-checkout', 'ppdw-checkout'],
	['ppdw-buildings-cafe-inside', 'ppdw-cafe'],
	['ppdw-wardrobe-garments', 'ppdw-wardrobe'],
	['sorya-ai-cover', 'sorya-cover'],
	['sorya-editor', 'sorya-editor'],
	['sorya-home', 'sorya-home'],
	['sorya-login', 'sorya-login'],
	['sastra-landing', 'sastra-cover']
];

async function variants(input, extract, base, widths, { jpg = true } = {}) {
	for (const w of widths) {
		const pipeline = () => {
			let s = sharp(input);
			if (extract) s = s.extract(extract);
			return s.resize({ width: w, withoutEnlargement: true });
		};
		await pipeline()
			.avif({ quality: 52, effort: 6 })
			.toFile(path.join(OUT, `${base}-${w}.avif`));
		await pipeline()
			.webp({ quality: 78 })
			.toFile(path.join(OUT, `${base}-${w}.webp`));
		if (jpg)
			await pipeline()
				.jpeg({ quality: 82, mozjpeg: true })
				.toFile(path.join(OUT, `${base}-${w}.jpg`));
	}
}

await mkdir(OUT, { recursive: true });
await variants(PORTRAIT_SRC, HERO_CROP, 'portrait', [360, 560]);
await variants(PORTRAIT_SRC, SQUARE_CROP, 'portrait-square', [240, 420]);
await variants(CV_PORTRAIT_SRC, CV_CROP, 'cv-portrait', [420]);
for (const [src, crop, base] of slides) {
	await variants(src, crop, base, [400, 720]);
}
for (const [src, base] of projects) {
	await variants(`assets-src/projects/${src}.png`, null, base, [640, 1100], { jpg: false });
}
// Apple touch icon from the SVG favicon.
await sharp('static/favicon.svg', { density: 400 }).resize(180, 180).png().toFile('static/apple-touch-icon.png');

console.log('Images written to', OUT);
