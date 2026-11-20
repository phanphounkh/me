import type { SkillMode } from './types';

export interface PipelineStage {
	id: string;
	step: string;
	title: string;
	short: string;
	detail: string;
	techniques: string[];
	mode: SkillMode;
}

/** The Khmer OCR pipeline as I study it — general techniques only, nothing proprietary. */
export const pipeline: PipelineStage[] = [
	{
		id: 'collect',
		step: '01',
		title: 'Collect',
		short: 'Document sources',
		detail:
			'Find and organise Khmer document images — printed, handwritten and historical (for example, DC-CAM archives) — with their source recorded, so later splits can be made per document.',
		techniques: ['Source tracking', 'Deduplication', 'Storage layout'],
		mode: 'hands-on'
	},
	{
		id: 'preprocess',
		step: '02',
		title: 'Preprocess',
		short: 'Clean the image',
		detail:
			'Make pages easier to read for a model: colour to grayscale, blur to suppress noise, edges and morphology to find structure, perspective transforms to flatten photographed pages.',
		techniques: ['Grayscale', 'Gaussian blur', 'Canny edges', 'Dilation / erosion', 'Perspective warp'],
		mode: 'hands-on'
	},
	{
		id: 'segment',
		step: '03',
		title: 'Segment',
		short: 'Page → lines',
		detail:
			'Split each page into text lines. Khmer vowels and subscripts extend above and below the baseline, so boxes need extra margin to avoid clipping characters.',
		techniques: ['Projection profiles', 'Contours', 'Line boxes'],
		mode: 'researching'
	},
	{
		id: 'annotate',
		step: '04',
		title: 'Annotate',
		short: 'Crop + transcribe',
		detail:
			'Crop each line, type its exact Khmer Unicode text and have it reviewed. Tools explored include eScriptorium and a purpose-built annotation prototype.',
		techniques: ['eScriptorium', 'Review queue', 'Khmer Unicode'],
		mode: 'hands-on'
	},
	{
		id: 'train',
		step: '05',
		title: 'Train',
		short: 'Adapt a model',
		detail:
			'Fine-tune pretrained text-recognition models on Khmer line images. Studying transfer learning, Transformer-based recognisers, LoRA/QLoRA and quantization.',
		techniques: ['PyTorch', 'Transfer learning', 'LoRA / QLoRA'],
		mode: 'researching'
	},
	{
		id: 'evaluate',
		step: '06',
		title: 'Evaluate',
		short: 'Measure honestly',
		detail:
			'Measure Character Error Rate and Word Error Rate on held-out documents. Splitting by source document prevents leakage and over-optimistic results.',
		techniques: ['CER', 'WER', 'Leakage-safe splits'],
		mode: 'researching'
	}
];

export const khmerChallenges = [
	{
		title: 'Stacked consonants',
		body: 'A coeng sign turns the next consonant into a subscript, so one visual cluster holds several code points.',
		example: 'ក + ្ + ស = ក្ស'
	},
	{
		title: 'Vowels around the base',
		body: 'Vowel signs sit above, below, before or after a consonant — line boxes must leave room for them.',
		example: 'កើ  កៀ  កុ'
	},
	{
		title: 'No spaces between words',
		body: 'Words run together; spaces mark phrases. Word-level metrics need careful segmentation.',
		example: 'ខ្ញុំទៅសាលារៀន'
	},
	{
		title: 'Scarce labelled data',
		body: 'Few public, verified Khmer handwriting datasets exist — data preparation is the core of the work.',
		example: 'line_0001.png → “…”'
	}
];

export const principles = [
	'Split data by source document, never by line, to avoid leakage.',
	'Report CER/WER only from held-out data — and say when there are no results yet.',
	'Keep transcriptions reviewable and traceable.',
	'Separate what I have built from what I am still studying.'
];

export const learningNow = [
	{ topic: 'Transformers & attention', note: 'How encoder–decoder recognisers read text images.' },
	{
		topic: 'Parameter-efficient fine-tuning',
		note: 'LoRA and QLoRA for adapting large pretrained models on small datasets.'
	},
	{ topic: 'Quantization', note: 'Making models smaller and faster to serve.' },
	{ topic: 'Production ML & MLOps', note: 'Training pipelines, evaluation tracking and deployment.' }
];
