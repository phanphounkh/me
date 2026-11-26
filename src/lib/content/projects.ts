import type { CompactProject, Project, ProjectCategory } from './types';

/**
 * Projects. Every repository link below was verified to exist (GitHub API, Nov 2026).
 * Status labels are deliberately conservative — nothing is labelled production-ready.
 */

export const categoryLabels: Record<ProjectCategory, string> = {
	ai: 'AI & Research',
	cv: 'Computer Vision',
	data: 'Data',
	fullstack: 'Full-Stack',
	'3d': '3D & Interactive',
	backend: 'Backend'
};

const SKAI_PRIVATE = 'Internship work at SKAI Technology — code, data and results are not public.';

export const projects: Project[] = [
	{
		slug: 'khmer-ocr-research',
		title: 'SORYA-AI · Khmer OCR Research',
		tagline: 'Recognising Khmer text in printed, handwritten and historical documents.',
		summary:
			'Research and development toward recognising Khmer text from document images, with a focus on the hard cases: historical pages and handwriting.',
		status: 'Research',
		categories: ['ai', 'cv'],
		tech: ['Python', 'OpenCV', 'PyTorch', 'OCR / HTR', 'eScriptorium'],
		context: 'SKAI Technology internship',
		live: 'https://chat.sorya-ai.com/app',
		liveLabel: 'Try Sorya AI',
		privateNote: SKAI_PRIVATE,
		cover: {
			kind: 'image',
			base: 'sorya-cover',
			alt: 'Illustration of a small white robot in a sun-patterned saffron scarf, sitting on a temple ledge beside an open book and looking out at Angkor Wat under a rising sun.',
			position: '70% 50%'
		},
		implemented: [
			'Khmer document collection and organisation',
			'Dataset preparation groundwork',
			'Image preprocessing experiments',
			'Annotation workflow exploration (including eScriptorium)'
		],
		planned: [
			'Handwritten text recognition model investigation',
			'Fine-tuning pretrained recognisers on Khmer line images',
			'CER / WER evaluation on held-out documents'
		],
		caseStudy: {
			problem:
				'A large amount of Khmer-language information exists only as images — scanned pages, photographs and handwritten or historical documents. Khmer script is hard for OCR: consonants stack into subscripts, vowels attach above, below and around them, and words are not separated by spaces. Labelled Khmer handwriting data is scarce.',
			motivation:
				'Making Khmer documents searchable and machine-readable makes the information in them accessible — for archives, researchers and everyday users.',
			role: 'AI/ML Engineering Intern. I research approaches, collect and organise document images, run preprocessing experiments, explore annotation tooling and plan evaluation.',
			approach: [
				'Survey OCR and handwritten text recognition (HTR) approaches and pretrained models suitable for Khmer.',
				'Collect document images from suitable sources, including historical material such as DC-CAM, and organise them for annotation.',
				'Experiment with preprocessing: grayscale conversion, denoising, edge detection, morphology and perspective correction.',
				'Explore page segmentation and line-level extraction so each training sample is one text line.',
				'Evaluate annotation and transcription tools, including eScriptorium, and design a review workflow.',
				'Plan evaluation with Character Error Rate (CER) and Word Error Rate (WER), with data splits that avoid leakage between documents.'
			],
			architecture: [
				'Document images',
				'Preprocessing',
				'Line segmentation',
				'Line crops + transcriptions',
				'Recognition model (pretrained, fine-tuned)',
				'CER / WER evaluation'
			],
			challenges: [
				'Complex script: stacked consonants, diacritics and no word spacing make line boxes and tokenisation error-prone.',
				'Historical pages: faded ink, stains, skew and uneven lighting.',
				'Handwriting varies widely between writers.',
				'Transcription is slow and needs careful review to be trustworthy.',
				'Large image collections need deliberate storage and organisation.'
			],
			status:
				'Ongoing research. Datasets are being collected and organised; not all collected pages are labelled or verified, and no model results are published.',
			learned: [
				'Data quality and honest evaluation matter as much as model choice.',
				'Practical OpenCV preprocessing for real document images.',
				'How annotation workflows shape the quality of a dataset.'
			],
			next: [
				'Complete a reviewed, line-level labelled subset.',
				'Fine-tune and compare pretrained recognisers on it.',
				'Report CER / WER on held-out documents.'
			]
		}
	},
	{
		slug: 'khmer-annotation-studio',
		title: 'Khmer Handwriting Annotation Studio',
		tagline: 'A web tool for turning scanned pages into line-level Khmer handwriting datasets.',
		summary:
			'Upload scanned pages, crop every handwritten line, transcribe it in Khmer Unicode, review the labels and export train/validation/test splits.',
		status: 'Prototype',
		categories: ['cv', 'data', 'fullstack'],
		tech: ['SvelteKit', 'FastAPI', 'PostgreSQL', 'OpenCV', 'Docker', 'Tailwind CSS', 'Konva'],
		context: 'SKAI Technology internship',
		privateNote: 'Built during the SKAI Technology internship — source code is not public.',
		cover: { kind: 'art', motif: 'annotation' },
		implemented: [
			'Upload document images and PDFs, with duplicate detection',
			'View and manage document pages',
			'Draw and adjust line boxes, with automatic line proposals (OpenCV)',
			'Crop each line to its own image',
			'Khmer transcription editor with autosave',
			'Review queue: approve, request correction or reject',
			'Dataset validation and export of line images with labels, split by source document'
		],
		planned: [
			'Pilot with real Khmer handwriting at a larger scale', // TODO(confirm)
			'Use trained Khmer recognisers to pre-fill transcriptions' // TODO(confirm)
		],
		caseStudy: {
			problem:
				'Training a Khmer handwriting recogniser needs thousands of accurately cropped and transcribed text lines. Doing this by hand in generic tools is slow and error-prone.',
			motivation:
				'A focused tool shortens the path from scanned page to clean, reviewable training data — and keeps the dataset honest.',
			role: 'Designed and built the prototype end to end: data model, API, image-processing steps and annotation interface.',
			approach: [
				'Model the workflow explicitly: upload → page rendering → line boxes → crops → transcription → review → export.',
				'Propose line boxes automatically with an OpenCV baseline, then let annotators correct them.',
				'Keep every transcription reviewable, with comments required for rejections.',
				'Export splits grouped by source document so pages from one book never leak between train and test.'
			],
			architecture: [
				'SvelteKit interface',
				'FastAPI REST API',
				'PostgreSQL',
				'Background image-processing jobs',
				'Docker Compose'
			],
			challenges: [
				'Khmer diacritics extend above and below a line — boxes must not clip them.',
				'Keyboard-first editing for fast annotation without losing Khmer input-method behaviour.',
				'Avoiding data leakage when splitting datasets.'
			],
			status: 'Working prototype, tested with synthetic sample pages. Not deployed for production use.',
			learned: [
				'How annotation UX directly affects dataset quality.',
				'Designing data pipelines around review and traceability.',
				'Combining classical computer vision with human correction.'
			],
			next: ['Pilot with real annotators and documents.', 'Connect trained recognition models for pre-labelling.']
		}
	},
	{
		slug: 'phnom-penh-digital-world',
		title: 'Phnom Penh Digital World',
		tagline: 'A multiplayer 3D city built on real Phnom Penh map data.',
		summary:
			'Walk the real streets of Daun Penh in 3D with other players, visit virtual shops, ride routed vehicles and try simulated deliveries — all built from OpenStreetMap data.',
		status: 'In Development',
		categories: ['3d', 'fullstack'],
		tech: ['SvelteKit', 'Three.js', 'MapLibre GL', 'FastAPI', 'PostgreSQL + PostGIS', 'Blender', 'Playwright'],
		context: 'Personal project',
		repo: 'https://github.com/phanphounkh/Phnom-Penh-Digital-World',
		cover: {
			kind: 'image',
			base: 'ppdw-cover',
			alt: 'A 3D street in Phnom Penh at sunset, with a player avatar, street signs in Khmer and a minimap.'
		},
		gallery: [
			{
				base: 'ppdw-multiplayer',
				alt: 'Two players meeting in the 3D city with the chat panel open.',
				caption: 'Multiplayer: chat, friends and presence.'
			},
			{
				base: 'ppdw-shop',
				alt: 'Inside a walk-in virtual shop carrying a product to the cart.',
				caption: 'Walk-in shop with a demo checkout.'
			},
			{
				base: 'ppdw-route',
				alt: 'Riding a motorbike along a routed path on a real street.',
				caption: 'Routing on the real road network.'
			}
		],
		implemented: [
			'3D city generated from OpenStreetMap data of Daun Penh',
			'Avatars and real-time multiplayer: chat, emotes and friends',
			'Marketplace: seller approval, virtual shop units, stocking and a demo checkout',
			'Bicycles and motorbikes on a routing graph that respects one-way streets',
			'Simulated deliveries and a demo-credit wallet (no real money)'
		],
		planned: ['Remaining roadmap phases in the repository'],
		caseStudy: {
			problem:
				'Most virtual worlds are fictional. I wanted to explore what an interactive digital version of Phnom Penh — built from real geographic data — could feel like.',
			motivation:
				'A hands-on way to learn 3D graphics, geospatial data, real-time systems and full-stack architecture in one project.',
			role: 'Solo developer: design, 3D pipeline, front end, back end and tests.',
			approach: [
				'Convert OpenStreetMap buildings and roads into 3D geometry.',
				'Build assets in Blender and load them as GLB models in Three.js.',
				'Keep the server authoritative for movement and vehicle speed.',
				'Store geospatial data in PostgreSQL with PostGIS.'
			],
			architecture: ['SvelteKit + Three.js client', 'FastAPI', 'PostgreSQL + PostGIS', 'OpenStreetMap snapshots'],
			challenges: [
				'Rendering a dense city smoothly in the browser.',
				'Synchronising many players in real time.',
				'Building a routing graph from raw map data.'
			],
			status:
				'Roadmap phases 1–7 are implemented; the project is still in development. Payments and deliveries are simulated.',
			learned: ['3D rendering performance', 'Geospatial data processing', 'Real-time, server-authoritative design'],
			next: ['Continue the remaining roadmap phases.']
		}
	},
	{
		slug: 'campus-eats',
		title: 'Campus Eats',
		tagline: 'A bilingual food-ordering prototype for a student canteen.',
		summary:
			'Students browse the menu, drag dishes into a cart, pay with a demo KHQR flow and track their order; staff manage orders and the menu.',
		status: 'Prototype',
		categories: ['fullstack', '3d'],
		tech: ['SvelteKit', 'FastAPI', 'PostgreSQL', 'Docker', 'Tailwind CSS', 'Three.js'],
		context: 'Personal project',
		repo: 'https://github.com/phanphounkh/campufood',
		cover: { kind: 'art', motif: 'cart' },
		implemented: [
			'English / Khmer menu browsing',
			'Interactive cart with quantity and total calculation',
			'Guest checkout with a demo KHQR payment flow (no real money)',
			'Live order tracking',
			'Admin: orders, menu, inventory and reports',
			'Tests with pytest, Vitest and Playwright'
		],
		planned: [
			'A full 3D marketplace — a separate Three.js prototype explored a 3D food court, which now lives inside Phnom Penh Digital World'
		],
		caseStudy: {
			problem: 'Ordering at a busy student canteen means queues and little visibility into order status.',
			motivation:
				'Practice building a complete product — ordering, payment flow, admin tools and tests — around a familiar, local use case.',
			role: 'Solo developer.',
			approach: [
				'SvelteKit front end with drag-and-drop ordering.',
				'FastAPI back end with PostgreSQL and migrations.',
				'Demo-only KHQR payment flow that is disabled in production.'
			],
			architecture: ['SvelteKit', 'FastAPI', 'PostgreSQL', 'Docker Compose'],
			challenges: ['Keeping the payment flow clearly demo-only.', 'Bilingual content throughout the UI.'],
			status: 'Working prototype. Payments are a demo; the 3D shopping experience is a separate prototype.',
			learned: ['End-to-end testing of a full product', 'Designing safe demo payment flows'],
			next: ['Merge the 3D shopping ideas into a single experience.']
		}
	},
	{
		slug: 'datahub',
		title: 'DataHub',
		tagline: 'A document data platform for collecting, reviewing and preparing datasets.',
		summary:
			'A platform designed to collect authorised documents, review them, manage annotation and export quality-checked datasets.',
		status: 'In Development',
		categories: ['data', 'fullstack'],
		tech: ['Next.js', 'FastAPI', 'PostgreSQL', 'Redis', 'Celery', 'S3-compatible storage', 'Docker'],
		context: 'Team project', // TODO(confirm): your role, and whether the repository may be linked
		cover: { kind: 'art', motif: 'pipeline' },
		implemented: [
			'Documentation-first baseline: requirements, architecture, API contract and threat model',
			'Foundation stack running locally: web and API scaffolding, database, queue, private storage and virus scanning'
		],
		planned: [
			'Document upload',
			'Dataset organisation',
			'Annotation workflows',
			'Administrative review',
			'Dataset export',
			'Data quality management'
		]
	},
	{
		slug: 'taskflow-api',
		title: 'TaskFlow API',
		tagline: 'A FastAPI backend built to practise professional API architecture.',
		summary: 'A task-management REST API organised into routers, services and repositories, with validation and tests.',
		status: 'Learning Project',
		categories: ['backend'],
		tech: ['Python', 'FastAPI', 'Pydantic', 'pytest'],
		context: 'Personal learning project', // TODO(confirm): publish to GitHub to add a link
		cover: { kind: 'art', motif: 'api' },
		implemented: [
			'REST endpoints to list, read, create, update and delete tasks',
			'Task analytics endpoint',
			'Layered design: API routing → service layer → repository',
			'Pydantic data validation',
			'pytest test suite'
		],
		caseStudy: {
			problem: 'Small APIs often grow into tangled code where routing, business rules and storage are mixed together.',
			motivation: 'Learn the structure used in maintainable backends before building larger services.',
			role: 'Solo learning project.',
			approach: [
				'Routers handle HTTP only.',
				'Services hold business rules.',
				'Repositories isolate storage, so it can be swapped or mocked in tests.'
			],
			architecture: ['FastAPI routers', 'Service layer', 'Repository', 'Pydantic schemas'],
			challenges: ['Choosing clear boundaries between layers.'],
			status: 'Learning project with a working API and tests.',
			learned: ['Repository and service patterns', 'REST API design', 'Testing FastAPI apps'],
			next: ['Add a database-backed repository and authentication.']
		}
	},
	{
		slug: 'student-performance-analytics',
		title: 'Student Performance Analytics',
		tagline: 'Exploratory data analysis and baseline models on student exam data.',
		summary:
			'A learning project for practising the data-science workflow on student exam scores, from cleaning to a first predictive model.',
		status: 'Learning Project',
		categories: ['data', 'ai'],
		tech: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'scikit-learn'],
		context: 'Personal learning project',
		cover: { kind: 'art', motif: 'chart' },
		// TODO(confirm): list the steps you have actually completed in `implemented`.
		goals: [
			'Data cleaning',
			'Descriptive statistics',
			'Data visualisation',
			'Correlation analysis',
			'Feature preparation',
			'Model training',
			'Baseline comparison',
			'Prediction evaluation'
		]
	}
];

/** More AI work — public repositories, shown as compact cards. */
export const moreAiWork: CompactProject[] = [
	{
		title: 'Khmer HTR (TrOCR)',
		summary:
			'A reproducible pipeline for fine-tuning TrOCR on Khmer handwriting, with a synthetic handwriting generator and CER/WER metrics. No benchmark results published yet.',
		status: 'Research',
		tech: ['PyTorch', 'Hugging Face Transformers', 'TrOCR'],
		context: 'Personal research',
		repo: 'https://github.com/phanphoun/ocr'
	},
	{
		title: 'KhmerDoc AI',
		summary:
			'Khmer-first document tooling: OCR, Khmer-aware text handling (syllables, subscripts) and retrieval-augmented answering over documents.',
		status: 'Prototype',
		tech: ['Python', 'OCR', 'RAG'],
		context: 'Personal project',
		repo: 'https://github.com/phanphoun/khmer-ocr'
	},
	{
		title: 'Cambo AI',
		summary:
			'A multi-provider AI assistant with document upload for grounded answers and an admin dashboard for usage telemetry.',
		status: 'Prototype',
		tech: ['FastAPI', 'React', 'PostgreSQL', 'LLM APIs'],
		context: 'Personal project',
		repo: 'https://github.com/phanphoun/cambo-ai',
		live: 'https://cambo-ai.vercel.app'
	},
	{
		title: 'AI Engineer Academy',
		summary:
			'A free, framework-free learning site with structured AI lessons, quizzes and an optional AI tutor that answers from the course content.',
		status: 'Prototype',
		tech: ['HTML', 'CSS', 'JavaScript', 'Gemini API'],
		context: 'Personal project',
		repo: 'https://github.com/phanphoun/ai-engineer',
		live: 'https://ai-engineer-flame.vercel.app'
	},
	{
		title: 'MLEDU',
		summary: 'A visual machine-learning roadmap with video lessons, notes, code snippets and progress tracking.',
		status: 'Prototype',
		tech: ['React', 'TypeScript', 'Tailwind CSS'],
		context: 'Personal project',
		repo: 'https://github.com/phanphounkh/MLEDU'
	}
];

/** Earlier web projects — preserved from the original portfolio (repositories verified). */
export const earlierWork: CompactProject[] = [
	{
		title: 'Football Field Booking App',
		summary:
			'Booking platform for players, captains, field owners and admins: role-based JWT auth, team management, bookings and notifications.',
		status: 'Learning Project',
		tech: ['React', 'Node.js', 'Express', 'MySQL', 'Tailwind CSS'],
		context: 'PNC team project',
		// The live demo (finall-vc1.vercel.app) loads, but its API is offline — not linked until fixed.
		repo: 'https://github.com/phanphoun/Football-Field-Booking-App'
	},
	{
		title: 'Student Management System',
		summary:
			'Students, teachers, courses, enrolments and grades with JWT auth, role-based access, CSV export and API docs.',
		status: 'Learning Project',
		tech: ['Django REST Framework', 'React', 'TypeScript', 'Tailwind CSS'],
		context: 'PNC team project',
		repo: 'https://github.com/phanphoun/student-management-system'
	},
	{
		title: 'Pitchside — 3D Field Booking',
		summary: 'Football field booking with a 3D field view and admin, owner and customer dashboards.',
		status: 'Prototype',
		tech: ['Next.js', 'React Three Fiber', 'FastAPI', 'PostgreSQL'],
		context: 'Personal project',
		repo: 'https://github.com/phanphounkh/3D-football'
	},
	{
		title: 'REST API',
		summary: 'A REST API with an Express back end and a React client.',
		status: 'Learning Project',
		tech: ['Node.js', 'Express', 'React'],
		context: 'Learning project',
		repo: 'https://github.com/phanphoun/REST-API'
	},
	{
		title: 'Express MySQL MVC',
		summary: 'A back-end project structured with the Model-View-Controller pattern on Express and MySQL.',
		status: 'Learning Project',
		tech: ['Node.js', 'Express', 'MySQL'],
		context: 'Learning project',
		repo: 'https://github.com/phanphoun/express-mysql-mvc'
	},
	{
		title: 'OOP TypeScript',
		summary: 'Object-oriented programming concepts and patterns implemented in TypeScript.',
		status: 'Learning Project',
		tech: ['TypeScript'],
		context: 'Learning project',
		repo: 'https://github.com/phanphoun/oop-typescript'
	}
];

export function getProject(slug: string): Project | undefined {
	return projects.find((p) => p.slug === slug);
}
