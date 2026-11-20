import type { Milestone, WorkArea } from './types';

/**
 * SKAI Technology internship.
 * Confidentiality: describe topics and skills only — no internal datasets, architecture,
 * metrics or private repositories.
 */
export const internship = {
	company: 'SKAI Technology',
	role: 'AI/ML Engineering Intern',
	location: 'Phnom Penh, Cambodia',
	start: 'Aug 2026',
	end: 'Dec 2026',
	/** Expected completion — the internship is ongoing at the time of writing. */
	expectedEnd: 'December 3, 2026',
	startISO: '2026-08',
	endISO: '2026-12-03',
	summary:
		'Moved from web development into machine learning and intelligent document processing: Khmer OCR research, handwriting dataset preparation, computer vision practice, model experimentation and AI application development.',
	/** Short bullets for the CV — keep to verified, non-confidential statements. */
	cvBullets: [
		'Research OCR and handwritten text recognition approaches for Khmer-language documents, including document preprocessing, page segmentation, line-level extraction and CER/WER evaluation methods.',
		'Prepare Khmer handwriting dataset material: collect and organise document images (including historical sources such as DC-CAM), and investigate line cropping, annotation and transcription workflows, including eScriptorium.',
		'Built a prototype annotation tool for line-level Khmer handwriting datasets (SvelteKit, FastAPI, PostgreSQL, OpenCV, Docker).',
		'Practise computer vision with Python, OpenCV, NumPy and Matplotlib: colour conversion, blurring, Canny edges, morphology and perspective transforms for document images.',
		'Study PyTorch, transfer learning and fine-tuning strategies (including LoRA/QLoRA and quantization) for adapting pretrained recognition models.'
	]
};

export const workAreas: WorkArea[] = [
	{
		id: 'ocr',
		title: 'Khmer OCR & document understanding',
		summary:
			'Investigating how to turn Khmer document images — printed, handwritten and historical — into reliable text.',
		items: [
			{ text: 'Preparing Khmer document datasets for machine learning', mode: 'hands-on' },
			{ text: 'Document preprocessing and image-quality checks', mode: 'hands-on' },
			{ text: 'Page segmentation and line-level text extraction', mode: 'researching' },
			{ text: 'Printed and handwritten Khmer text recognition techniques', mode: 'researching' },
			{ text: 'Annotation and transcription workflows', mode: 'researching' },
			{ text: 'Evaluation with Character / Word Error Rate (CER, WER)', mode: 'researching' },
			{ text: 'Pretrained models and fine-tuning strategies', mode: 'researching' }
		]
	},
	{
		id: 'dataset',
		title: 'Khmer handwriting dataset preparation',
		summary: 'Building the groundwork for a line-level Khmer handwriting dataset.',
		items: [
			{ text: 'Collecting and organising document images', mode: 'hands-on' },
			{ text: 'Exploring historical Khmer document sources, including DC-CAM', mode: 'researching' },
			{ text: 'Workflows for cropping handwritten text into lines', mode: 'researching' },
			{ text: 'Evaluating eScriptorium for document annotation', mode: 'hands-on' },
			{ text: 'Dataset quality, data splits and training preparation', mode: 'researching' },
			{ text: 'Storage strategies for large image collections', mode: 'researching' }
		],
		note: 'Dataset work is ongoing: not all collected pages are labelled or verified, and none of it is claimed as a finished training set.'
	},
	{
		id: 'cv',
		title: 'Computer vision & image processing',
		summary: 'Practical exercises with Python, OpenCV, NumPy and Matplotlib, applied to document images.',
		items: [
			{ text: 'Image loading, visualisation and annotation', mode: 'hands-on' },
			{ text: 'RGB/BGR and grayscale conversion', mode: 'hands-on' },
			{ text: 'Resizing and cropping', mode: 'hands-on' },
			{ text: 'Gaussian blur and Canny edge detection', mode: 'hands-on' },
			{ text: 'Dilation, erosion and morphological operations', mode: 'hands-on' },
			{ text: 'Perspective transformation', mode: 'hands-on' },
			{ text: 'Document image preprocessing', mode: 'hands-on' }
		]
	},
	{
		id: 'models',
		title: 'AI model research & experimentation',
		summary:
			'Learning how models are trained, adapted and evaluated — separating what I have built from what I am studying.',
		// TODO(confirm): move items between hands-on / researching to match your experience.
		items: [
			{ text: 'PyTorch and neural network fundamentals', mode: 'hands-on' },
			{ text: 'Training-pipeline experiments', mode: 'hands-on' },
			{ text: 'Google Colab and Kaggle notebooks', mode: 'hands-on' },
			{ text: 'Transformers', mode: 'researching' },
			{ text: 'Transfer learning and model fine-tuning', mode: 'researching' },
			{ text: 'LoRA, QLoRA and quantization', mode: 'researching' },
			{ text: 'Model evaluation methodology', mode: 'researching' }
		]
	},
	{
		id: 'apps',
		title: 'AI application development',
		summary: 'Integrating AI workflows into web applications.',
		items: [
			{ text: 'Python and FastAPI REST APIs', mode: 'hands-on' },
			{ text: 'PostgreSQL data models', mode: 'hands-on' },
			{ text: 'Svelte / SvelteKit interfaces', mode: 'hands-on' },
			{ text: 'Docker-based local environments', mode: 'hands-on' },
			{ text: 'LLM API integration', mode: 'hands-on' },
			{ text: 'LangChain and LangGraph concepts', mode: 'researching' }
		]
	}
];

/** Narrative milestones — approximate. TODO(confirm): precise dates before publishing. */
export const internshipTimeline: Milestone[] = [
	{
		period: 'August 2026',
		title: 'Internship begins',
		body: 'Joined SKAI Technology as an AI/ML Engineering Intern and began the transition from web development toward machine learning.',
		state: 'done'
	},
	{
		period: 'September – October 2026',
		title: 'Khmer OCR research',
		body: 'Researched Khmer OCR, document processing and AI engineering workflows; explored document sources and annotation tools.',
		state: 'done'
	},
	{
		period: 'November 2026',
		title: 'Going deeper',
		body: 'Deepening computer vision, data preparation and model-training knowledge, and building AI-supporting applications.',
		state: 'current'
	},
	{
		period: 'December 2026',
		title: 'Conclusion & reflection',
		body: 'Internship expected to conclude on December 3, 2026, with a reflection on results and next steps.',
		state: 'planned'
	}
];

export const education = [
	{
		school: 'Passerelles numériques Cambodia (PNC)',
		program: 'Web Programming',
		detail: 'Third-year student', // TODO(confirm): program name, degree and dates
		location: 'Phnom Penh, Cambodia',
		period: null as string | null,
		current: true,
		highlights: [
			'Foundations of software development: HTML, CSS, JavaScript, PHP/Laravel, Vue, React, Node.js, SQL, OOP and algorithms.',
			'Team projects including a football field booking platform and a student management system.'
		]
	},
	{
		school: 'EDM Center',
		program: null as string | null, // TODO(confirm): program details
		detail: null as string | null,
		location: 'Preah Vihear, Cambodia',
		period: null as string | null, // TODO(confirm): dates
		current: false,
		highlights: [] as string[]
	}
];

/** "My Journey" — the long arc. Undated steps stay undated until confirmed. */
export const journey: Milestone[] = [
	{
		period: 'Preah Vihear',
		title: 'EDM Center',
		body: 'Studied at EDM Center in Preah Vihear province.',
		state: 'done'
	},
	{
		period: 'PNC · Web Programming',
		title: 'Learning to build software',
		body: 'Started Web Programming at Passerelles numériques Cambodia: front-end, back-end, databases, OOP and algorithms.',
		state: 'done'
	},
	{
		period: 'Full-stack projects',
		title: 'Shipping complete applications',
		body: 'Built team and personal projects — booking platforms, management systems, APIs — with Vue, React, Node.js, Laravel, Django and FastAPI.',
		state: 'done'
	},
	{
		period: 'Aug 2026 – Dec 2026',
		title: 'AI/ML Engineering Intern · SKAI Technology',
		body: 'Shifted focus to machine learning, computer vision and Khmer OCR research.',
		state: 'current'
	},
	{
		period: 'Next',
		title: 'Junior AI/ML engineering',
		body: 'Looking for a role where I can keep building computer vision and document AI systems, and grow into production machine learning.',
		state: 'planned'
	}
];
