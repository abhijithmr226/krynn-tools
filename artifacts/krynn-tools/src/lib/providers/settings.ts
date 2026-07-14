import type { ProviderKey, ProviderStats } from './types';

const KEYS_STORAGE = 'kt_provider_keys';
const SELECTIONS_STORAGE = 'kt_tool_provider_selections';
const STATS_STORAGE = 'kt_provider_stats';
const ENABLED_STORAGE = 'kt_provider_enabled';
const GLOBAL_STORAGE = 'kt_global_settings';

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ── API Keys ──

export function getApiKeys(): ProviderKey[] {
  return readJson<ProviderKey[]>(KEYS_STORAGE, []);
}

export function setApiKey(providerId: string, apiKey: string): void {
  const keys = getApiKeys();
  const existing = keys.find(k => k.providerId === providerId);
  if (existing) {
    existing.apiKey = apiKey;
    existing.isValid = undefined;
  } else {
    keys.push({
      providerId,
      apiKey,
      createdAt: new Date().toISOString(),
    });
  }
  writeJson(KEYS_STORAGE, keys);
}

export function removeApiKey(providerId: string): void {
  const keys = getApiKeys().filter(k => k.providerId !== providerId);
  writeJson(KEYS_STORAGE, keys);
}

export function getApiKey(providerId: string): string | null {
  const key = getApiKeys().find(k => k.providerId === providerId);
  return key?.apiKey ?? null;
}

export function validateApiKeyFormat(providerId: string, key: string): boolean {
  if (!key || key.trim().length < 8) return false;
  if (providerId === 'openai') return key.startsWith('sk-');
  if (providerId === 'anthropic') return key.startsWith('sk-ant-');
  if (providerId === 'google-gemini') return key.length > 20;
  if (providerId === 'cloudconvert') return key.length >= 20;
  return key.length >= 8;
}

// ── Tool → Provider Selection ──

export function getToolProviderSelection(toolSlug: string): string {
  const selections = readJson<Record<string, string>>(SELECTIONS_STORAGE, {});
  return selections[toolSlug] ?? '';
}

export function setToolProviderSelection(toolSlug: string, providerId: string): void {
  const selections = readJson<Record<string, string>>(SELECTIONS_STORAGE, {});
  selections[toolSlug] = providerId;
  writeJson(SELECTIONS_STORAGE, selections);
}

// ── Provider Stats ──

export function getProviderStats(): ProviderStats[] {
  return readJson<ProviderStats[]>(STATS_STORAGE, []);
}

export function recordProviderRequest(providerId: string, success: boolean, timeMs: number): void {
  const stats = getProviderStats();
  let stat = stats.find(s => s.providerId === providerId);
  if (!stat) {
    stat = { providerId, requests: 0, failures: 0, avgTimeMs: 0 };
    stats.push(stat);
  }
  stat.requests += 1;
  if (!success) stat.failures += 1;
  stat.avgTimeMs =
    Math.round(((stat.avgTimeMs * (stat.requests - 1)) + timeMs) / stat.requests);
  stat.lastUsed = new Date().toISOString();
  if (!success) stat.lastError = new Date().toISOString();
  writeJson(STATS_STORAGE, stats);
}

// ── Provider Enabled/Disabled ──

export function isProviderEnabled(providerId: string): boolean {
  const enabled = readJson<Record<string, boolean>>(ENABLED_STORAGE, {});
  return enabled[providerId] ?? true;
}

export function setProviderEnabled(providerId: string, enabled: boolean): void {
  const enabledMap = readJson<Record<string, boolean>>(ENABLED_STORAGE, {});
  enabledMap[providerId] = enabled;
  writeJson(ENABLED_STORAGE, enabledMap);
}

// ── Global Settings ──

export interface GlobalSettings {
  defaultProvider: string;
  maintenanceMode: boolean;
  rateLimit: number;
  maxUploadSize: number;
}

export function getGlobalSettings(): GlobalSettings {
  return readJson<GlobalSettings>(GLOBAL_STORAGE, {
    defaultProvider: 'local-libreoffice',
    maintenanceMode: false,
    rateLimit: 60,
    maxUploadSize: 50,
  });
}

export function setGlobalSettings(settings: Partial<GlobalSettings>): void {
  const current = getGlobalSettings();
  writeJson(GLOBAL_STORAGE, { ...current, ...settings });
}
