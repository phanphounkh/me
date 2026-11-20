import type { SkillGroup } from './types';

/**
 * Skills grouped by domain. No proficiency percentages: each group states where the skills
 * were actually used, so a reader can judge depth from evidence.
 */
export const skillGroups: SkillGroup[] = [
	{
		title: 'AI / Machine Learning',
		icon: 'brain',
		skills: [
			'PyTorch',
			'Machine learning fundamentals',
			'Deep learning fundamentals',
			'Model evaluation',
			'Fine-tuning concepts'
		],
		evidence: 'Internship research and model-training experiments; Khmer HTR pipeline.'
	},
	{
		title: 'Computer Vision',
		icon: 'scan',
		skills: ['OpenCV', 'NumPy', 'Image processing', 'OCR / HTR workflows', 'Document preprocessing'],
		evidence: 'Internship exercises on document images; line detection in the annotation studio.'
	},
	{
		title: 'Programming',
		icon: 'code',
		skills: ['Python', 'JavaScript', 'TypeScript', 'SQL', 'HTML', 'CSS'],
		evidence: 'Daily languages across research scripts, APIs and web apps.'
	},
	{
		title: 'Data Analytics',
		icon: 'chart',
		skills: ['Pandas', 'Matplotlib', 'Data exploration', 'Data visualisation'],
		evidence: 'Dataset inspection for Khmer OCR; student performance learning project.'
	},
	{
		title: 'Backend',
		icon: 'server',
		skills: ['FastAPI', 'REST APIs', 'PostgreSQL', 'Backend architecture'],
		evidence: 'Annotation studio, Campus Eats, Phnom Penh Digital World, TaskFlow API.'
	},
	{
		title: 'Frontend',
		icon: 'layout',
		skills: ['Svelte', 'SvelteKit', 'Tailwind CSS', 'Three.js'],
		evidence: 'Annotation interface, 3D city client and this portfolio.'
	},
	{
		title: 'DevOps & Tools',
		icon: 'terminal',
		skills: ['Git', 'GitHub', 'GitLab', 'Docker', 'Linux', 'Google Colab', 'Kaggle'],
		evidence: 'Docker Compose environments for every full-stack project; Debian Linux daily.'
	}
];

export const currentlyLearning = [
	'Transformers',
	'Advanced PyTorch',
	'Model optimisation',
	'LLM fine-tuning',
	'Production ML systems',
	'MLOps'
];

/** Compact list for the CV (most relevant first). */
export const cvSkills = [
	{
		label: 'AI / ML',
		value: 'PyTorch, machine learning and deep learning fundamentals, model evaluation (CER/WER), fine-tuning concepts'
	},
	{ label: 'Computer Vision', value: 'OpenCV, NumPy, image processing, document preprocessing, OCR/HTR workflows' },
	{ label: 'Languages', value: 'Python, JavaScript, TypeScript, SQL, HTML, CSS' },
	{ label: 'Data', value: 'Pandas, Matplotlib, data exploration and visualisation' },
	{ label: 'Backend', value: 'FastAPI, REST APIs, PostgreSQL' },
	{ label: 'Frontend', value: 'Svelte, SvelteKit, Tailwind CSS, Three.js' },
	{ label: 'Tools', value: 'Git, GitHub, GitLab, Docker, Linux, Google Colab, Kaggle' }
];
