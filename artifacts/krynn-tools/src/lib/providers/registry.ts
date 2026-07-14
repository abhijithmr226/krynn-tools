import type { ProviderConfig } from './types';

export const providers: ProviderConfig[] = [
  // ── PDF Providers ──
  {
    id: 'local-libreoffice',
    name: 'LibreOffice (Local)',
    category: 'pdf',
    type: 'local',
    requiresApiKey: false,
    description: 'Free local PDF processing via LibreOffice WASM',
    icon: 'FileText',
  },
  {
    id: 'cloudconvert',
    name: 'CloudConvert',
    category: 'pdf',
    type: 'cloud',
    requiresApiKey: true,
    description: 'Cloud-based file conversion with 200+ format support',
    website: 'https://cloudconvert.com',
    icon: 'Cloud',
  },
  {
    id: 'convertapi',
    name: 'ConvertAPI',
    category: 'pdf',
    type: 'cloud',
    requiresApiKey: true,
    description: 'PDF conversion and manipulation API service',
    website: 'https://convertapi.com',
    icon: 'ArrowsClockwise',
  },
  {
    id: 'adobe-pdf',
    name: 'Adobe PDF Services',
    category: 'pdf',
    type: 'cloud',
    requiresApiKey: true,
    description: 'Adobe\'s official PDF processing API',
    website: 'https://adobe.com',
    icon: 'FileText',
  },

  // ── OCR Providers ──
  {
    id: 'local-tesseract',
    name: 'Tesseract.js (Local)',
    category: 'ocr',
    type: 'local',
    requiresApiKey: false,
    description: 'Free local OCR via Tesseract.js WASM engine',
    icon: 'ScanText',
  },
  {
    id: 'google-vision',
    name: 'Google Cloud Vision',
    category: 'ocr',
    type: 'cloud',
    requiresApiKey: true,
    description: 'Google\'s powerful OCR and text detection API',
    website: 'https://cloud.google.com/vision',
    icon: 'Eye',
  },
  {
    id: 'ocr-space',
    name: 'OCR.space',
    category: 'ocr',
    type: 'cloud',
    requiresApiKey: true,
    description: 'Free-tier OCR API with multi-language support',
    website: 'https://ocr.space',
    icon: 'ScanText',
  },

  // ── Image Providers ──
  {
    id: 'local-canvas',
    name: 'Canvas API (Local)',
    category: 'image',
    type: 'local',
    requiresApiKey: false,
    description: 'Free local image processing via browser Canvas',
    icon: 'Image',
  },
  {
    id: 'removebg',
    name: 'Remove.bg',
    category: 'image',
    type: 'cloud',
    requiresApiKey: true,
    description: 'AI-powered background removal service',
    website: 'https://remove.bg',
    icon: 'Eraser',
  },
  {
    id: 'clipdrop',
    name: 'Clipdrop',
    category: 'image',
    type: 'cloud',
    requiresApiKey: true,
    description: 'AI image enhancement and manipulation suite',
    website: 'https://clipdrop.co',
    icon: 'Image',
  },
  {
    id: 'stability-ai',
    name: 'Stability AI',
    category: 'image',
    type: 'cloud',
    requiresApiKey: true,
    description: 'AI image generation and editing API',
    website: 'https://stability.ai',
    icon: 'Sparkle',
  },

  // ── AI Providers ──
  {
    id: 'openai',
    name: 'OpenAI',
    category: 'ai',
    type: 'cloud',
    requiresApiKey: true,
    description: 'GPT-4o and other OpenAI language models',
    website: 'https://openai.com',
    icon: 'Lightning',
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    category: 'ai',
    type: 'cloud',
    requiresApiKey: true,
    description: 'Claude 3.5 Sonnet and other Anthropic models',
    website: 'https://anthropic.com',
    icon: 'Brain',
  },
  {
    id: 'google-gemini',
    name: 'Google Gemini',
    category: 'ai',
    type: 'cloud',
    requiresApiKey: true,
    description: 'Google\'s Gemini language model API',
    website: 'https://ai.google.dev',
    icon: 'Star',
  },
  {
    id: 'ollama',
    name: 'Ollama (Local)',
    category: 'ai',
    type: 'local',
    requiresApiKey: false,
    description: 'Run LLMs locally via Ollama on localhost:11434',
    website: 'https://ollama.ai',
    icon: 'Desktop',
  },

  // ── Video Providers ──
  {
    id: 'local-ffmpeg',
    name: 'FFmpeg.wasm (Local)',
    category: 'video',
    type: 'local',
    requiresApiKey: false,
    description: 'Free local video processing via FFmpeg.wasm',
    icon: 'Video',
  },
  {
    id: 'replicate',
    name: 'Replicate',
    category: 'video',
    type: 'cloud',
    requiresApiKey: true,
    description: 'Cloud video processing and AI model hosting',
    website: 'https://replicate.com',
    icon: 'Cloud',
  },

  // ── Conversion Providers ──
  {
    id: 'local-browser',
    name: 'Browser APIs (Local)',
    category: 'conversion',
    type: 'local',
    requiresApiKey: false,
    description: 'Free format conversion using browser File APIs',
    icon: 'ArrowsClockwise',
  },
];

export function getAllProviders(): ProviderConfig[] {
  return [...providers];
}

export function getProvidersByCategory(category: string): ProviderConfig[] {
  return providers.filter(p => p.category === category);
}

export function getProviderById(id: string): ProviderConfig | undefined {
  return providers.find(p => p.id === id);
}

export function getDefaultProvider(toolCategory: string): ProviderConfig {
  const local = providers.find(
    p => p.category === toolCategory && p.type === 'local'
  );
  if (local) return local;
  return providers.find(p => p.category === toolCategory) ?? providers[0];
}
