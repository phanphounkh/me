import { error } from '@sveltejs/kit';
import { getProject, projects } from '#lib/content/projects.ts';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => projects.map((p) => ({ slug: p.slug }));

export const load: PageLoad = ({ params }) => {
	const index = projects.findIndex((p) => p.slug === params.slug);
	const project = getProject(params.slug);
	if (!project) error(404, 'Project not found');
	return {
		project,
		prev: projects[index - 1] ?? null,
		next: projects[index + 1] ?? null
	};
};
