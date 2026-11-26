import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const PROJECT_SLUGS = [
	'khmer-ocr-research',
	'khmer-annotation-studio',
	'sastra-ai',
	'phnom-penh-digital-world',
	'campus-eats',
	'datahub',
	'taskflow-api',
	'student-performance-analytics'
];

/** Collects console errors, page errors and failed same-origin requests. */
function watchErrors(page: Page) {
	const errors: string[] = [];
	page.on('console', (m) => m.type() === 'error' && errors.push(`console: ${m.text()}`));
	page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
	page.on('response', (r) => {
		if (r.status() >= 400 && r.url().startsWith('http://localhost')) errors.push(`${r.status()} ${r.url()}`);
	});
	return errors;
}

async function noHorizontalOverflow(page: Page) {
	const overflow = await page.evaluate(
		() => document.documentElement.scrollWidth - document.documentElement.clientWidth
	);
	expect(overflow, 'page should not scroll horizontally').toBeLessThanOrEqual(0);
}

test.describe('home page', () => {
	test('renders the hero with name, title, CTAs and skill constellation, without errors', async ({ page }) => {
		const errors = watchErrors(page);
		await page.goto('/');
		await expect(page.getByRole('heading', { level: 1, name: 'Phoun Phan' })).toBeVisible();
		await expect(page.getByText('Building Intelligent Solutions with AI & Code.')).toBeVisible();
		await expect(page.getByRole('link', { name: 'View My Projects' })).toHaveAttribute('href', '#projects');
		await expect(page.getByRole('link', { name: 'Download CV' }).first()).toHaveAttribute(
			'href',
			'/files/Phoun-Phan-CV.pdf'
		);
		await expect(page.getByRole('link', { name: 'Contact Me' })).toHaveAttribute('href', '#contact');
		const constellation = page.getByRole('group', { name: 'Skill constellation' });
		await expect(constellation).toBeVisible();
		await expect(constellation.getByRole('button')).toHaveCount(13);
		const portrait = page.getByRole('img', { name: 'Portrait of Phoun Phan' });
		await expect(portrait).toBeVisible();
		await expect
			.poll(() => portrait.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0))
			.toBe(true);
		await noHorizontalOverflow(page);
		// Scroll the whole page so lazy images and reveal animations run.
		await page.evaluate(async () => {
			for (let y = 0; y < document.body.scrollHeight; y += 600) {
				window.scrollTo({ top: y, behavior: 'instant' });
				await new Promise((r) => setTimeout(r, 40));
			}
		});
		await page.waitForTimeout(800);
		await noHorizontalOverflow(page);
		expect(errors).toEqual([]);
	});

	test('every section exists and all its content becomes visible', async ({ page }) => {
		await page.goto('/');
		for (const id of ['about', 'journey', 'experience', 'projects', 'skills', 'research', 'resume', 'contact']) {
			const section = page.locator(`#${id}`);
			await section.scrollIntoViewIfNeeded();
			await expect(section.getByRole('heading', { level: 2 }).first()).toBeVisible();
		}
		// After scrolling through, no reveal element may remain hidden.
		await page.evaluate(async () => {
			for (let y = 0; y < document.body.scrollHeight; y += 400) {
				window.scrollTo({ top: y, behavior: 'instant' });
				await new Promise((r) => setTimeout(r, 30));
			}
		});
		await page.waitForTimeout(1000);
		const hidden = await page.locator('[data-reveal]:not(.is-revealed)').count();
		expect(hidden).toBe(0);
	});

	test('content is visible with reduced motion', async ({ browser }) => {
		const context = await browser.newContext({ reducedMotion: 'reduce' });
		const page = await context.newPage();
		await page.goto('/#skills');
		const opacity = await page
			.locator('#skills .card')
			.first()
			.evaluate((el) => getComputedStyle(el).opacity);
		expect(Number(opacity)).toBe(1);
		await context.close();
	});

	test('skill constellation reveals descriptions and can be paused', async ({ page, isMobile }) => {
		await page.goto('/');
		const constellation = page.getByRole('group', { name: 'Skill constellation' });
		const python = constellation.getByRole('button', { name: /^Python\./ });
		const tooltip = python.locator('..').locator('.tooltip');

		if (isMobile) {
			await python.tap();
		} else {
			await python.hover();
		}
		await expect(tooltip).toBeVisible();
		await expect(tooltip).toContainText('OCR research');
		await expect(constellation.locator('.connector.is-active')).toHaveCount(1);

		if (isMobile) {
			await python.tap();
			await expect(tooltip).toBeHidden();
			await python.tap();
			await expect(tooltip).toBeVisible();

			await page.setViewportSize({ width: 320, height: 844 });
			const colab = constellation.getByRole('button', { name: /^Google Colab\./ });
			await colab.tap();
			await expect(colab.locator('..').locator('.tooltip')).toBeVisible();
		} else {
			await page.mouse.move(0, 0);
			await expect(tooltip).toBeHidden();
			await python.focus();
			await expect(tooltip).toBeVisible();
			await page.keyboard.press('Escape');
			await expect(tooltip).toBeHidden();
		}

		const pause = constellation.getByRole('button', { name: 'Pause orbit animation' });
		await pause.click();
		await expect(constellation.getByRole('button', { name: 'Resume orbit animation' })).toHaveAttribute(
			'aria-pressed',
			'true'
		);
		await noHorizontalOverflow(page);
	});

	test('section links scroll to their targets', async ({ page, isMobile }) => {
		await page.goto('/');
		for (const [label, id] of [
			['Projects', 'projects'],
			['Research', 'research'],
			['Contact', 'contact']
		] as const) {
			if (isMobile) await page.getByRole('button', { name: 'Open menu' }).click();
			const scope = isMobile ? page.locator('#mobile-menu') : page.getByRole('navigation', { name: 'Main' });
			await scope.getByRole('link', { name: label, exact: true }).click();
			await expect(page).toHaveURL(new RegExp(`#${id}$`));
			await expect(page.locator(`#${id}`)).toBeInViewport();
		}
	});

	test('theme toggle switches and persists', async ({ page }) => {
		await page.goto('/');
		const html = page.locator('html');
		await expect(html).toHaveAttribute('data-theme', 'dark');
		await page.getByRole('button', { name: 'Switch to light theme' }).click();
		await expect(html).toHaveAttribute('data-theme', 'light');
		await page.reload();
		await expect(html).toHaveAttribute('data-theme', 'light');
		await page.getByRole('button', { name: 'Switch to dark theme' }).click();
		await expect(html).toHaveAttribute('data-theme', 'dark');
	});

	test('project filters narrow the list', async ({ page }) => {
		await page.goto('/#projects');
		const cards = page.locator('#projects > div > ul').first().locator('> li');
		await expect(cards).toHaveCount(8);
		await page.getByRole('button', { name: /^Backend/ }).click();
		await expect(page.getByRole('button', { name: /^Backend/ })).toHaveAttribute('aria-pressed', 'true');
		await expect(cards).toHaveCount(1);
		await expect(cards.first()).toContainText('TaskFlow API');
		await page.getByRole('button', { name: /^All/ }).click();
		await expect(cards).toHaveCount(8);
	});

	test('experience tabs work with mouse and keyboard', async ({ page }) => {
		await page.goto('/#experience');
		const tab = (name: RegExp) => page.getByRole('tab', { name });
		await tab(/Computer vision/).click();
		await expect(page.getByRole('tabpanel').filter({ hasText: 'Canny' })).toBeVisible();
		await page.keyboard.press('ArrowRight');
		await expect(tab(/AI model research/)).toBeFocused();
		await expect(tab(/AI model research/)).toHaveAttribute('aria-selected', 'true');
	});

	test('contact form validates, then composes a mailto link', async ({ page }) => {
		await page.goto('/#contact');
		await page.getByRole('button', { name: 'Compose email' }).click();
		await expect(page.getByText('Please enter your name.')).toBeVisible();
		await expect(page.getByLabel('Name')).toBeFocused();

		const form = page.locator('#contact form');
		await form.getByLabel('Name', { exact: true }).fill('Test Recruiter');
		await form.getByLabel('Email', { exact: true }).fill('recruiter@example.com');
		await form.getByLabel('Message', { exact: true }).fill('Hello Phoun, we would like to talk about a role.');
		await page.getByRole('button', { name: 'Compose email' }).click();
		await expect(page.getByRole('status').filter({ hasText: 'email app should open' })).toBeVisible();
		const draft = page.getByRole('link', { name: 'open the draft again' });
		await expect(draft).toHaveAttribute(
			'href',
			/^mailto:phanphoun855@gmail\.com\?subject=Portfolio%20enquiry%20from%20Test%20Recruiter&body=Hello/
		);
	});

	test('mobile menu opens, traps attention and closes with Escape', async ({ page, isMobile }) => {
		test.skip(!isMobile, 'mobile only');
		await page.goto('/');
		const button = page.getByRole('button', { name: 'Open menu' });
		await button.click();
		await expect(page.locator('#mobile-menu')).toHaveClass(/open/);
		await expect(page.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true');
		await page.keyboard.press('Escape');
		await expect(page.locator('#mobile-menu')).not.toHaveClass(/open/);
		await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused();
		// Closed menu takes no space under the bar.
		const barHeight = await page.locator('header.bar').evaluate((el) => el.getBoundingClientRect().height);
		expect(barHeight).toBeLessThanOrEqual(66);
	});

	test('back-to-top button returns to the top', async ({ page }) => {
		await page.goto('/#contact');
		// Let the smooth hash scroll finish before interacting.
		await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(1000);
		await page.waitForTimeout(1200);
		const back = page.getByRole('button', { name: 'Back to top' });
		await expect(back).toBeVisible();
		await back.click();
		await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(5);
	});
});

test.describe('other pages', () => {
	for (const slug of PROJECT_SLUGS) {
		test(`case study /projects/${slug}/ renders`, async ({ page }) => {
			const errors = watchErrors(page);
			await page.goto(`/projects/${slug}/`);
			await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
			await expect(page.getByRole('link', { name: 'All projects' })).toHaveAttribute('href', '/#projects');
			await noHorizontalOverflow(page);
			expect(errors).toEqual([]);
		});
	}

	test('CV page and PDF download', async ({ page, request }) => {
		const errors = watchErrors(page);
		await page.goto('/cv/');
		await expect(page.getByRole('heading', { level: 1, name: 'PHOUN PHAN' })).toBeVisible();
		await expect(page.getByRole('img', { name: 'Portrait of Phoun Phan' })).toBeVisible();
		const pdf = await request.get('/files/Phoun-Phan-CV.pdf');
		expect(pdf.ok()).toBe(true);
		expect((await pdf.body()).subarray(0, 5).toString()).toBe('%PDF-');
		await noHorizontalOverflow(page);
		expect(errors).toEqual([]);
	});

	test('unknown URLs show the 404 page', async ({ page }) => {
		const response = await page.goto('/no-such-page/');
		expect(response?.status()).toBe(404);
		await expect(page.getByText('This page could not be found.')).toBeVisible();
		await expect(page.getByRole('link', { name: 'Back to the portfolio' })).toBeVisible();
	});

	test('sitemap and robots are served', async ({ request }) => {
		const sitemap = await request.get('/sitemap.xml');
		expect(sitemap.ok()).toBe(true);
		const xml = await sitemap.text();
		for (const slug of PROJECT_SLUGS) expect(xml).toContain(`/projects/${slug}/`);
		const robots = await request.get('/robots.txt');
		expect(await robots.text()).toContain('Sitemap:');
	});
});

test.describe('chat assistant', () => {
	const launcher = (page: Page) => page.getByRole('button', { name: 'Chat with Phoun’s assistant' });
	const panel = (page: Page) => page.locator('#chat-panel');

	async function openChat(page: Page) {
		await page.goto('/');
		await launcher(page).click();
		await expect(panel(page)).toHaveClass(/open/);
		await expect(page.getByRole('heading', { name: "Phoun's Assistant" })).toBeVisible();
	}

	/** Answers /api/chat like Gemini would, and records what the page sent. */
	async function mockAi(page: Page, answer: string) {
		const bodies: { messages: { role: string; content: string }[] }[] = [];
		await page.route('**/api/chat', async (route) => {
			bodies.push(route.request().postDataJSON());
			await route.fulfill({
				status: 200,
				headers: {
					'content-type': 'text/plain; charset=utf-8',
					'x-chat-mode': 'ai',
					'x-chat-sources': encodeURIComponent(JSON.stringify([{ title: 'Khmer OCR pipeline', href: '/#research' }]))
				},
				body: answer
			});
		});
		return bodies;
	}

	test('opens with the input focused, switches tabs by keyboard and closes with Escape', async ({ page }) => {
		const errors = watchErrors(page);
		await openChat(page);
		await expect(page.getByLabel('Ask about Phoun')).toBeFocused();

		await page.getByRole('tab', { name: 'Ask AI' }).focus();
		await page.keyboard.press('ArrowRight');
		await expect(page.getByRole('tab', { name: 'Email' })).toHaveAttribute('aria-selected', 'true');
		await expect(page.getByRole('tab', { name: 'Email' })).toBeFocused();
		await page.keyboard.press('End');
		await expect(page.getByRole('tab', { name: 'Call' })).toHaveAttribute('aria-selected', 'true');
		await expect(page.getByRole('tabpanel', { name: 'Call' })).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(panel(page)).not.toHaveClass(/open/);
		await expect(launcher(page)).toBeFocused();
		await expect(launcher(page)).toHaveAttribute('aria-expanded', 'false');
		await noHorizontalOverflow(page);
		expect(errors).toEqual([]);
	});

	test('Ask AI sends the conversation and renders the answer with sources', async ({ page }) => {
		const bodies = await mockAi(page, 'Phoun researches **Khmer OCR**.\n\n- Python\n- OpenCV');
		await openChat(page);
		await page.getByRole('button', { name: 'What are his strongest skills?' }).click();

		const log = page.getByRole('log', { name: 'Conversation' });
		await expect(log.locator('strong', { hasText: 'Khmer OCR' })).toBeVisible();
		await expect(log.getByRole('listitem')).toHaveText(['Python', 'OpenCV']);
		await expect(log.getByRole('link', { name: 'Khmer OCR pipeline' })).toHaveAttribute('href', '/#research');
		await expect(page.getByText('Online', { exact: true })).toBeVisible();
		expect(bodies[0]).toEqual({ messages: [{ role: 'user', content: 'What are his strongest skills?' }] });

		// Follow-ups carry the conversation so far.
		await page.getByLabel('Ask about Phoun').fill('Tell me more');
		await page.keyboard.press('Enter');
		await expect.poll(() => bodies.length).toBe(2);
		expect(bodies[1]!.messages.map((m) => m.role)).toEqual(['user', 'assistant', 'user']);
	});

	test('answers from the portfolio when Gemini is not configured', async ({ page }) => {
		await openChat(page);
		await page.getByLabel('Ask about Phoun').fill('What is his phone number?');
		await page.keyboard.press('Enter');
		const log = page.getByRole('log', { name: 'Conversation' });
		await expect(log.getByText('+855 71 326 6899')).toBeVisible();
		await expect(log.getByText('Offline answer — straight from the portfolio.')).toBeVisible();
		await expect(page.getByText('Offline mode · portfolio excerpts')).toBeVisible();
	});

	test('offers a retry when the request fails', async ({ page }) => {
		let fail = true;
		await page.route('**/api/chat', (route) =>
			fail
				? route.fulfill({
						status: 500,
						contentType: 'application/json',
						body: JSON.stringify({ message: 'Server error' })
					})
				: route.fulfill({ status: 200, headers: { 'x-chat-mode': 'ai' }, body: 'Back online.' })
		);
		await openChat(page);
		await page.getByRole('button', { name: 'How can I hire him?' }).click();
		await expect(page.getByText('Server error')).toBeVisible();
		fail = false;
		await page.getByRole('button', { name: 'Try again' }).click();
		await expect(page.getByText('Back online.')).toBeVisible();
		await expect(page.getByText('Server error')).toHaveCount(0);
	});

	test('Email tab validates, then composes a mailto draft', async ({ page }) => {
		await openChat(page);
		await page.getByRole('tab', { name: 'Email' }).click();
		const tab = page.getByRole('tabpanel', { name: 'Email' });
		await tab.getByRole('button', { name: 'Open in email app' }).click();
		await expect(tab.getByText('Please enter your name.')).toBeVisible();
		await expect(tab.getByLabel('Your name')).toBeFocused();

		await tab.getByLabel('Your name').fill('Test Recruiter');
		await tab.getByLabel('Your email').fill('recruiter@example.com');
		await tab.getByLabel('Message').fill('Hello Phoun, we would like to talk about a role.');
		await tab.getByRole('button', { name: 'Open in email app' }).click();
		await expect(tab.getByRole('link', { name: 'open the draft again' })).toHaveAttribute(
			'href',
			/^mailto:phanphoun855@gmail\.com\?subject=Portfolio%20enquiry%20from%20Test%20Recruiter&body=Hello/
		);
	});

	test('Call tab links to the phone number and copies it', async ({ page, context }) => {
		await context.grantPermissions(['clipboard-read', 'clipboard-write']);
		await openChat(page);
		await page.getByRole('tab', { name: 'Call' }).click();
		const tab = page.getByRole('tabpanel', { name: 'Call' });
		await expect(tab.getByRole('link', { name: 'Call now' })).toHaveAttribute('href', 'tel:+855713266899');
		await expect(tab.getByText('in Phnom Penh (UTC+7)')).toBeVisible();
		await tab.getByRole('button', { name: 'Copy number' }).click();
		await expect(tab.getByRole('button', { name: 'Number copied' })).toBeVisible();
		expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('+855 71 326 6899');
	});
});

test.describe('accessibility (axe, WCAG 2.1 AA)', () => {
	for (const theme of ['dark', 'light'] as const) {
		for (const path of ['/', '/projects/khmer-ocr-research/', '/cv/']) {
			test(`${path} has no serious violations (${theme})`, async ({ page }) => {
				await page.addInitScript((t) => localStorage.setItem('theme', t), theme);
				await page.emulateMedia({ reducedMotion: 'reduce' });
				await page.goto(path);
				await page.waitForTimeout(400);
				if (path === '/') {
					// Check the chat panel too (open, with a reply on screen).
					await page.getByRole('button', { name: 'Chat with Phoun’s assistant' }).click();
					await page.getByLabel('Ask about Phoun').fill('phone');
					await page.keyboard.press('Enter');
					await expect(page.getByText('Offline answer — straight from the portfolio.')).toBeVisible();
				}
				const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
				const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
				expect(
					serious.map(
						(v) =>
							`${v.id}: ${v.nodes
								.map((n) => n.target.join(' '))
								.slice(0, 3)
								.join(' | ')}`
					),
					'serious/critical axe violations'
				).toEqual([]);
			});
		}
	}
});
