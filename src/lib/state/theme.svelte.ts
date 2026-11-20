export type ThemeName = 'dark' | 'light';

const THEME_COLORS: Record<ThemeName, string> = { dark: '#060912', light: '#f6f8fc' };

class ThemeState {
	current = $state<ThemeName>('dark');

	/** Sync with the value app.html applied before first paint. */
	init() {
		const applied = document.documentElement.dataset.theme;
		this.current = applied === 'light' ? 'light' : 'dark';
	}

	toggle() {
		this.set(this.current === 'dark' ? 'light' : 'dark');
	}

	set(next: ThemeName) {
		this.current = next;
		document.documentElement.dataset.theme = next;
		document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[next]);
		try {
			localStorage.setItem('theme', next);
		} catch {
			// Storage unavailable (private mode) — the theme still applies for this visit.
		}
	}
}

export const theme = new ThemeState();
