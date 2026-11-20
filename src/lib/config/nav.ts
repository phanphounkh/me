export interface NavItem {
	id: string;
	label: string;
	/** Shown in the desktop bar (all items appear in the mobile menu and footer). */
	desktop: boolean;
}

/** Home-page sections, in page order. Links use `/#id` so they work from every page. */
export const navItems: NavItem[] = [
	{ id: 'about', label: 'About', desktop: true },
	{ id: 'journey', label: 'Journey', desktop: true },
	{ id: 'experience', label: 'Experience', desktop: true },
	{ id: 'projects', label: 'Projects', desktop: true },
	{ id: 'skills', label: 'Skills', desktop: true },
	{ id: 'research', label: 'Research', desktop: true },
	{ id: 'resume', label: 'Resume', desktop: false },
	{ id: 'contact', label: 'Contact', desktop: true }
];

export const sectionHref = (id: string) => `/#${id}`;
