import type { HeroSkill, SkillGroup } from './types';

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
		evidence: 'Annotation studio, Bondarnh ERP, Phnom Penh Digital World.'
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

export const heroSkills: HeroSkill[] = [
	{
		name: 'Python',
		category: 'Core language',
		icon: 'python',
		description: 'My main language for OCR research, model experiments, APIs and automation.',
		x: 19,
		y: 15,
		tooltip: 'right'
	},
	{
		name: 'PyTorch',
		category: 'Deep learning',
		icon: 'pytorch',
		description: 'Training and evaluating neural networks for Khmer printed and handwritten text recognition.',
		x: 43,
		y: 7,
		tooltip: 'bottom'
	},
	{
		name: 'FastAPI',
		category: 'Backend',
		icon: 'fastapi',
		description: 'Building typed REST APIs that turn AI workflows into usable products.',
		x: 74,
		y: 13,
		tooltip: 'left'
	},
	{
		name: 'OpenCV',
		category: 'Computer vision',
		icon: 'opencv',
		description: 'Preprocessing document images, detecting text lines and improving OCR input quality.',
		x: 89,
		y: 36,
		tooltip: 'left'
	},
	{
		name: 'NumPy',
		category: 'Scientific computing',
		icon: 'numpy',
		description: 'Numerical arrays and image operations behind dataset preparation and model experiments.',
		x: 82,
		y: 65,
		tooltip: 'left'
	},
	{
		name: 'Pandas',
		category: 'Data analysis',
		icon: 'pandas',
		description: 'Exploring datasets, organising annotations and analysing recognition results.',
		x: 68,
		y: 85,
		tooltip: 'top'
	},
	{
		name: 'Docker',
		category: 'DevOps',
		icon: 'docker',
		description: 'Creating reproducible development and deployment environments with Docker Compose.',
		x: 42,
		y: 92,
		tooltip: 'top'
	},
	{
		name: 'PostgreSQL',
		category: 'Database',
		icon: 'postgresql',
		description: 'Designing relational data for annotation tools, full-stack applications and APIs.',
		x: 17,
		y: 82,
		tooltip: 'right'
	},
	{
		name: 'Svelte',
		category: 'Frontend',
		icon: 'svelte',
		description: 'Building responsive interfaces for annotation tools, dashboards and this portfolio.',
		x: 7,
		y: 59,
		tooltip: 'right'
	},
	{
		name: 'Git',
		category: 'Version control',
		icon: 'git',
		description: 'Tracking research code and collaborating on full-stack and AI projects.',
		x: 13,
		y: 35,
		tooltip: 'right'
	},
	{
		name: 'Google Colab',
		category: 'AI workspace',
		icon: 'googlecolab',
		description: 'Running cloud notebooks for model training, experimentation and reproducible research.',
		x: 31,
		y: 32,
		tooltip: 'bottom'
	},
	{
		name: 'Kaggle',
		category: 'ML practice',
		icon: 'kaggle',
		description: 'Exploring datasets and practising machine learning through notebooks and competitions.',
		x: 61,
		y: 32,
		tooltip: 'bottom'
	}
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
