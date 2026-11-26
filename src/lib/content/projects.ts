import type { CompactProject, Demo, Project, ProjectCategory } from './types';

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
		demo: {
			kind: 'link',
			url: 'https://www.linkedin.com/posts/ksabbe_for-the-past-few-months-skai-technology-ugcPost-7510963811672211456-pqoh/',
			label: 'Demo on LinkedIn'
		},
		privateNote: SKAI_PRIVATE,
		cover: {
			kind: 'image',
			base: 'sorya-cover',
			alt: 'Illustration of a small white robot in a sun-patterned saffron scarf, sitting on a temple ledge beside an open book and looking out at Angkor Wat under a rising sun.',
			position: '70% 50%'
		},
		gallery: [
			{
				base: 'sorya-editor',
				alt: "Sorya's document editor: a scanned historical Khmer page side by side with its reconstructed, editable text and a design panel.",
				caption: 'Document editor: the scanned page beside its reconstructed, editable Khmer text.'
			},
			{
				base: 'sorya-home',
				alt: "Sorya's home screen: a greeting, the prompt box with Fast and Smart modes, and pinned chats, recent chats, projects and documents.",
				caption: 'Home: ask anything or drop a document, with chats, projects and files close by.'
			},
			{
				base: 'sorya-login',
				alt: "Sorya's sign-in page with Google and email options beside the Angkor sunrise illustration.",
				caption: 'Sign-in with Google or email.'
			}
		],
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
		cover: {
			kind: 'image',
			base: 'annotation-cover',
			alt: 'Promotional graphic for the Khmer Handwriting Annotation Studio: a laptop showing a handwritten Khmer page with one line boxed and transcribed, beside the steps upload documents, annotate line by line and export training data.',
			position: '10% 30%'
		},
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
		slug: 'sastra-ai',
		title: 'Sastra AI',
		tagline: 'A Khmer-first AI assistant with multiple model providers, document Q&A and an admin portal.',
		summary:
			'A full-stack assistant for Cambodian users: chat with Gemini or Ollama models, ask questions about uploaded documents, let the model call tools such as web search and report export, and manage everything from a separate admin portal. Previously called Cambo AI.',
		status: 'Prototype',
		categories: ['ai', 'fullstack'],
		tech: [
			'FastAPI',
			'React',
			'PostgreSQL',
			'Gemini API',
			'Ollama',
			'TypeScript',
			'Redux Toolkit',
			'sentence-transformers',
			'Docker'
		],
		context: 'Personal project',
		repo: 'https://github.com/road-to-machine-learning-and-ai/sastra',
		live: 'https://cambo-ai.vercel.app',
		liveLabel: 'Landing page',
		demo: { kind: 'youtube', id: '9umW0PXzVX4', title: 'Sastra AI demo' },
		cover: {
			kind: 'image',
			base: 'sastra-cover',
			alt: 'The Sastra AI chat app in Khmer: a greeting, topic cards for Angkor Wat, the Khmer language, history, technology and the economy, suggestion chips and the prompt box.'
		},
		gallery: [
			{
				base: 'sastra-landing',
				alt: 'The Sastra AI landing page in Khmer: a dark and gold hero section beside a sample chat that drafts a Word document.',
				caption: 'The public landing page, in Khmer.'
			}
		],
		implemented: [
			'Streaming chat routed across Google Gemini and Ollama (local models and cloud models such as MiniMax)',
			'Chat modes for general chat, Khmer–English translation, code, search, documents and images',
			'Document upload with retrieval-augmented answers, using local sentence-transformer embeddings',
			'Tool calling: web search, page fetch, calculator, Khmer lunar calendar, a Cambodia company directory and image generation',
			'Report export to PDF, Word, Markdown and CSV — from a chat request or from any answer',
			'Accounts with hashed passwords, JWT sessions, admin / member / guest roles and one-click guest access',
			'Separate admin portal: user management, provider connection tests, usage telemetry and an audit log',
			'An admin-only coding agent behind a feature flag, with allow-listed commands and approve / reject for every change',
			'pytest suite for the agent, retrieval, tools, prompt assembly and Khmer calendar'
		],
		planned: [
			'Deploy the backend and chat app — only the public landing page is online today',
			'Move embeddings to a hosted API so the backend fits free-tier memory limits'
		],
		caseStudy: {
			problem:
				'General-purpose AI assistants are built English-first. Answers in Khmer are uneven, local knowledge such as Cambodian companies, festivals and the lunar calendar is thin, and useful output like reports has to be copied out by hand.',
			motivation:
				'Build a complete AI product end to end — model routing, retrieval, tools, accounts and operations — for Khmer-speaking users.',
			role: 'Solo developer: backend, the chat app, the admin portal and the landing page.',
			approach: [
				'A FastAPI backend with a provider layer, so Gemini and Ollama models share one streaming interface and admins can add endpoints.',
				'Retrieval over uploaded documents: chunking, local sentence-transformer embeddings and similarity search.',
				'A small tool registry the model can call, from web search to PDF and Word export (ReportLab, python-docx).',
				'A prompt builder that layers Khmer cultural rules and per-mode instructions.',
				'React 19 + Redux Toolkit for the chat app, and a separate React admin portal for users, providers, telemetry and logs.'
			],
			architecture: ['React chat app + admin portal', 'FastAPI', 'Gemini · Ollama', 'PostgreSQL + document index'],
			challenges: [
				'Keeping one streaming interface across providers with different APIs.',
				'Local embedding models need roughly 0.5–0.8 GB of RAM — more than most free hosting tiers offer.',
				'Letting a model run tools and propose code changes safely: allow-listed commands, timeouts and human approval.'
			],
			status:
				'Working prototype that runs locally with Docker Compose. Only the public landing page is deployed so far.',
			learned: [
				'Designing provider-agnostic LLM backends',
				'Retrieval-augmented generation end to end',
				'Tool calling and safe tool execution',
				'Running an app with telemetry and audit logs'
			],
			next: ['Deploy the backend and chat app.', 'Switch to hosted embeddings to cut memory use.']
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
		demo: {
			kind: 'youtube',
			id: 'ElaXg-DnGZE',
			title: 'A night walk around Wat Phnom Roundabout in Phnom Penh Digital World'
		},
		cover: {
			kind: 'image',
			base: 'ppdw-cover',
			alt: 'A player avatar on a lamp-lit pavement at Wat Phnom Roundabout at night, with the place card, minimap and nearby chat of the 3D city.'
		},
		gallery: [
			{
				base: 'ppdw-multiplayer',
				alt: "One player's view: another player nearby, a chat line and the People panel listing them as an online friend.",
				caption: 'Multiplayer: chat, friends and presence.'
			},
			{
				base: 'ppdw-wardrobe',
				alt: 'The wardrobe panel beside an avatar in a saffron cap and t-shirt, with garment and colour choices.',
				caption: "Making an avatar in the city's wardrobe."
			},
			{
				base: 'ppdw-shop',
				alt: 'Inside Sokha Snacks: the shopkeeper behind the counter and two items in the basket.',
				caption: 'Walk-in shops with a shopkeeper and a basket.'
			},
			{
				base: 'ppdw-checkout',
				alt: 'Paying at the counter: a receipt reading "Paid. It\'s yours.", marked as demo money.',
				caption: 'Paying at the counter with a clearly labelled demo checkout.'
			},
			{
				base: 'ppdw-cafe',
				alt: 'Inside the Riverside Café: tables, the counter and stairs to the upper floor.',
				caption: 'Real OpenStreetMap buildings with generated interiors.'
			},
			{
				base: 'ppdw-route',
				alt: 'Riding a motorbike along a highlighted route on Calmette (Street 53) at 38 km/h, with the next turn shown.',
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
		slug: 'kamrieng-high-school',
		title: 'Kamrieng High School Website',
		tagline: 'A bilingual Khmer–English website and admin CMS for a public high school in Battambang.',
		summary:
			"The official website of Kamrieng High School, built as a Passerelles numériques Cambodia Virtual Company (VC2) team project: news, achievements, governance, documents and the school's operations report for families and the community, plus an admin back office for staff.",
		status: 'Completed',
		categories: ['fullstack'],
		tech: ['Laravel', 'Next.js', 'Tailwind CSS', 'MySQL', 'Supabase', 'Alpine.js', 'TypeScript', 'next-intl'],
		context: 'PNC Virtual Company (VC2) team project',
		repo: 'https://github.com/phanphoun/kamrieng-highschooll',
		live: 'https://kamrieng-highschool.vercel.app/en',
		liveLabel: 'Live site',
		cover: {
			kind: 'image',
			base: 'kamrieng-cover',
			alt: 'Home page of the Kamrieng High School website: a Khmer welcome headline over a photo of the school staff, with the bilingual navigation bar.'
		},
		gallery: [
			{
				base: 'kamrieng-about',
				alt: 'About page with the school at a glance: founded in 2000, 21,253 m² of land, 2,126 students, 51 teachers and 42 classes.',
				caption: 'About: the school at a glance, its vision, mission and history.'
			},
			{
				base: 'kamrieng-news',
				alt: 'News page with category filters and article cards for school events and exam notices.',
				caption: 'News with categories for ministry news, school news, announcements and events.'
			},
			{
				base: 'kamrieng-report',
				alt: 'School Operations Report page: a numbered section list beside general school information for 2024–2025.',
				caption: "The school's operations report, published section by section."
			},
			{
				base: 'kamrieng-governance',
				alt: 'Governance page describing the structure and management systems and the learning culture, in Khmer and English.',
				caption: 'Governance: structure, management systems and learning culture.'
			}
		],
		implemented: [
			'Bilingual Khmer / English public site: home, about, governance, news, achievements, documents, operations report, contact and donate',
			'Admin back office: news, achievements, teachers, statistics, messages, users, settings and audit logs',
			'Staff accounts with role-based access',
			'Laravel version: online enrolment with tracking codes, an events calendar, a photo gallery and site search',
			'Laravel version: feature and unit tests for public pages, enrolment, admin CRUD and permissions'
		],
		caseStudy: {
			problem:
				'A public high school needs one place where families and the community can find news, achievements, documents and school data — in Khmer and English — and that staff can keep up to date without a developer.',
			motivation:
				"PNC's Virtual Company: a student team builds a real website the way a small software company would, with a backlog, sprints and pull requests.",
			role: "Developer on the team. My commits in the Laravel codebase cover the project setup, the product backlog and sprint documents, merging teammates' feature branches, and CI and code-style fixes.",
			approach: [
				'Write the work as user stories in a product backlog and deliver it in sprints, one feature branch per story.',
				'Laravel 11 with Blade, Tailwind CSS and Alpine.js for the public site and the admin CMS, on MySQL.',
				'Khmer and English throughout, and role-based access for the admin area.',
				'Feature and unit tests for public pages, enrolment, admin CRUD and permissions.',
				'The live site runs on a Next.js 15 + Supabase version, with locale routes (/en, /km) and an admin dashboard.'
			],
			challenges: [
				'Integrating feature branches from several developers into one codebase.',
				'Keeping Khmer and English content consistent on every page.',
				'Letting non-technical staff update content safely, through roles and permissions.'
			],
			status:
				"Completed and live as the school's website. The repository linked here is the team's Laravel version; the live site runs on a Next.js + Supabase version.",
			learned: [
				'Working as a team with a backlog, sprints and pull requests',
				'Laravel MVC, Blade and role-based access',
				'Building bilingual Khmer–English interfaces'
			]
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
		repo: 'https://github.com/phanphoun/Football-Field-Booking-App',
		demo: { kind: 'link', url: 'https://canva.link/football-field-booking-app', label: 'Demo on Canva' }
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

/** Where a demo can be watched outside the site. */
export const demoUrl = (d: Demo) => (d.kind === 'youtube' ? `https://www.youtube.com/watch?v=${d.id}` : d.url);

export function getProject(slug: string): Project | undefined {
	return projects.find((p) => p.slug === slug);
}
