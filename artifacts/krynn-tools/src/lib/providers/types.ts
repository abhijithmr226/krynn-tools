export interface ProviderConfig {
  id: string;
  name: string;
  category: 'pdf' | 'ocr' | 'image' | 'ai' | 'video' | 'conversion';
  type: 'local' | 'cloud';
  requiresApiKey: boolean;
  description: string;
  website?: string;
  icon?: string;
}

export interface ProviderKey {
  providerId: string;
  apiKey: string;
  createdAt: string;
  lastUsed?: string;
  isValid?: boolean;
}

export interface ProviderStats {
  providerId: string;
  requests: number;
  failures: number;
  avgTimeMs: number;
  lastUsed?: string;
  lastError?: string;
}

export interface ToolProviderSetting {
  toolSlug: string;
  selectedProviderId: string;
}
