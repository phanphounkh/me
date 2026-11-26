/**
 * Content model for the portfolio.
 *
 * All site text lives in src/lib/content/*.ts — edit there, not in components.
 * Anything marked `TODO(confirm)` in a comment is unverified: confirm it before publishing.
 * Fields typed `null` are intentionally hidden until a verified value is supplied.
 */

export type ProjectStatus = 'Completed' | 'Prototype' | 'In Development' | 'Research' | 'Learning Project';

export type ProjectCategory = 'ai' | 'cv' | 'data' | 'fullstack' | '3d' | 'backend';

/** Generated SVG cover motifs, used when no real screenshot exists (never fake screenshots). */
export type CoverMotif = 'ocr' | 'annotation' | 'cart' | 'pipeline' | 'api' | 'chart' | 'grid3d' | 'llm';

export type Cover =
	/** `position` is a CSS object-position, for when the crop must favour one side (e.g. '70% 50%'). */
	{ kind: 'image'; base: string; alt: string; position?: string } | { kind: 'art'; motif: CoverMotif };

export interface GalleryImage {
	base: string;
	alt: string;
	caption: string;
}

export interface CaseStudy {
	problem: string;
	motivation: string;
	role: string;
	approach: string[];
	/** High-level only. Never describe proprietary SKAI Technology architecture. */
	architecture?: string[];
	challenges: string[];
	status: string;
	learned: string[];
	/** Omit for finished projects. */
	next?: string[];
}

export interface Project {
	slug: string;
	title: string;
	tagline: string;
	summary: string;
	status: ProjectStatus;
	categories: ProjectCategory[];
	tech: string[];
	/** Where the work happened, e.g. "SKAI Technology internship" or "Personal project". */
	context: string;
	repo?: string;
	live?: string;
	/** Text for the `live` link; defaults to "Live demo". */
	liveLabel?: string;
	/** Shown instead of a code link when the code cannot be public. */
	privateNote?: string;
	cover: Cover;
	gallery?: GalleryImage[];
	/** Verified, working features. */
	implemented?: string[];
	/** Planned or envisioned — always shown separately from `implemented`. */
	planned?: string[];
	/** Learning goals (for learning projects whose completed steps are not yet confirmed). */
	goals?: string[];
	caseStudy?: CaseStudy;
}

export interface CompactProject {
	title: string;
	summary: string;
	status: ProjectStatus;
	tech: string[];
	context: string;
	repo?: string;
	live?: string;
}

export type SkillMode = 'hands-on' | 'researching';

export interface WorkItem {
	text: string;
	mode: SkillMode;
}

export interface WorkArea {
	id: string;
	title: string;
	summary: string;
	items: WorkItem[];
	note?: string;
}

export interface Milestone {
	period: string;
	title: string;
	body: string;
	state: 'done' | 'current' | 'planned';
}

export interface SkillGroup {
	title: string;
	icon: string;
	skills: string[];
	evidence: string;
}

export type HeroSkillIcon =
	| 'python'
	| 'fastapi'
	| 'pytorch'
	| 'opencv'
	| 'numpy'
	| 'pandas'
	| 'postgresql'
	| 'docker'
	| 'svelte'
	| 'git'
	| 'googlecolab'
	| 'kaggle';

export interface HeroSkill {
	name: string;
	category: string;
	icon: HeroSkillIcon;
	description: string;
	x: number;
	y: number;
	tooltip: 'top' | 'bottom' | 'left' | 'right';
}
