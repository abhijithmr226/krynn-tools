import { useState, useEffect, useMemo } from 'react';
import { Link } from 'wouter';
import {
  ArrowLeft,
  Key,
  Gear,
  ChartBar,
  Globe,
  CheckCircle,
  XCircle,
  Warning,
  Trash,
  PencilSimple,
  FloppyDisk,
  ArrowCounterClockwise,
  CaretDown,
  Shield,
  Lightning,
  Cloud,
  Desktop,
  Eye,
  EyeSlash,
  Info,
} from '@phosphor-icons/react';
import { getAllProviders, getProvidersByCategory, getDefaultProvider } from '@/lib/providers/registry';
import {
  getApiKeys,
  setApiKey,
  removeApiKey,
  getApiKey,
  validateApiKeyFormat,
  getProviderStats,
  getGlobalSettings,
  setGlobalSettings,
  isProviderEnabled,
} from '@/lib/providers/settings';
import type { ProviderKey, ProviderStats } from '@/lib/providers/types';

const CATEGORIES = [
  { id: 'pdf', name: 'PDF', icon: '📄' },
  { id: 'ocr', name: 'OCR', icon: '🔍' },
  { id: 'image', name: 'Image', icon: '🖼️' },
  { id: 'ai', name: 'AI', icon: '🧠' },
  { id: 'video', name: 'Video', icon: '🎬' },
  { id: 'conversion', name: 'Conversion', icon: '🔄' },
] as const;

const keyInputStyles =
  'w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm font-mono placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all';

function StatusDot({ status }: { status: 'valid' | 'invalid' | 'none' }) {
  const color =
    status === 'valid'
      ? 'bg-emerald-500'
      : status === 'invalid'
        ? 'bg-red-500'
        : 'bg-muted-foreground/30';
  return <span className={`inline-block w-2.5 h-2.5 rounded-full ${color}`} />;
}

export default function SettingsPage() {
  const [apiKeys, setApiKeysState] = useState<ProviderKey[]>([]);
  const [stats, setStats] = useState<ProviderStats[]>([]);
  const [globalSettings, setGlobalSettingsState] = useState(getGlobalSettings());
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [keyInput, setKeyInput] = useState('');
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'keys' | 'selection' | 'stats' | 'global'>('keys');
  const [testingKey, setTestingKey] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<Record<string, 'success' | 'error' | null>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('pdf');

  useEffect(() => {
    setApiKeysState(getApiKeys());
    setStats(getProviderStats());
    setGlobalSettingsState(getGlobalSettings());
  }, []);

  const allProviders = useMemo(() => getAllProviders(), []);
  const catProviders = useMemo(() => getProvidersByCategory(selectedCategory), [selectedCategory]);

  const totalRequests = useMemo(() => stats.reduce((s, p) => s + p.requests, 0), [stats]);
  const totalFailures = useMemo(() => stats.reduce((s, p) => s + p.failures, 0), [stats]);
  const avgTime = useMemo(() => {
    if (stats.length === 0) return 0;
    return Math.round(stats.reduce((s, p) => s + p.avgTimeMs, 0) / stats.length);
  }, [stats]);
  const activeCount = useMemo(
    () => apiKeys.filter(k => k.isValid !== false).length,
    [apiKeys]
  );

  function handleSaveKey(providerId: string) {
    if (!keyInput.trim()) return;
    setApiKey(providerId, keyInput.trim());
    setApiKeysState(getApiKeys());
    setEditingKey(null);
    setKeyInput('');
  }

  function handleRemoveKey(providerId: string) {
    removeApiKey(providerId);
    setApiKeysState(getApiKeys());
    setTestResult(prev => ({ ...prev, [providerId]: null }));
  }

  async function handleTestKey(providerId: string) {
    const key = getApiKey(providerId);
    if (!key) return;
    setTestingKey(providerId);
    setTestResult(prev => ({ ...prev, [providerId]: null }));
    // Simulate validation — in production this would ping the real API
    await new Promise(r => setTimeout(r, 1200));
    const valid = validateApiKeyFormat(providerId, key);
    setTestResult(prev => ({ ...prev, [providerId]: valid ? 'success' : 'error' }));
    setTestingKey(null);
  }

  function handleGlobalChange(key: string, value: unknown) {
    const next = { ...globalSettings, [key]: value };
    setGlobalSettingsState(next);
    setGlobalSettings(next as Record<string, unknown>);
  }

  function getKeyStatus(providerId: string): 'valid' | 'invalid' | 'none' {
    const k = apiKeys.find(x => x.providerId === providerId);
    if (!k) return 'none';
    if (k.isValid === false) return 'invalid';
    return 'valid';
  }

  const tabs = [
    { id: 'keys' as const, label: 'API Keys', icon: Key },
    { id: 'selection' as const, label: 'Providers', icon: Globe },
    { id: 'stats' as const, label: 'Usage Stats', icon: ChartBar },
    { id: 'global' as const, label: 'Global', icon: Gear },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container-app py-8 px-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-muted text-muted-foreground hover:bg-border hover:text-foreground transition-all"
          >
            <ArrowLeft size={18} weight="bold" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-sm text-muted-foreground">
              Manage providers, API keys, and global configuration
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-2xl bg-muted/50 border border-border mb-8 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-card text-foreground shadow-sm border border-border'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon size={16} weight={activeTab === tab.id ? 'fill' : 'duotone'} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab: API Keys ── */}
        {activeTab === 'keys' && (
          <div className="space-y-4">
            {CATEGORIES.map(cat => {
              const providers = allProviders.filter(p => p.category === cat.id);
              const cloudProviders = providers.filter(p => p.requiresApiKey);
              if (cloudProviders.length === 0) return null;
              return (
                <div key={cat.id} className="rounded-2xl border border-border bg-card overflow-hidden">
                  <div className="px-5 py-4 border-b border-border flex items-center gap-3">
                    <span className="text-lg">{cat.icon}</span>
                    <h3 className="font-semibold text-foreground">{cat.name} Providers</h3>
                  </div>
                  <div className="divide-y divide-border">
                    {cloudProviders.map(provider => {
                      const isEditing = editingKey === provider.id;
                      const existingKey = apiKeys.find(k => k.providerId === provider.id);
                      const status = getKeyStatus(provider.id);
                      const isTesting = testingKey === provider.id;
                      const result = testResult[provider.id];
                      const isVisible = showKey[provider.id];

                      return (
                        <div key={provider.id} className="px-5 py-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2.5 mb-1">
                                {provider.type === 'cloud' ? (
                                  <Cloud size={16} weight="duotone" className="text-blue-500 flex-shrink-0" />
                                ) : (
                                  <Desktop size={16} weight="duotone" className="text-emerald-500 flex-shrink-0" />
                                )}
                                <span className="font-medium text-foreground text-sm">
                                  {provider.name}
                                </span>
                                <StatusDot status={status} />
                                {existingKey && (
                                  <span className="text-xs text-muted-foreground">
                                    Added {new Date(existingKey.createdAt).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground ml-6.5">
                                {provider.description}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {!isEditing && (
                                <>
                                  {existingKey && (
                                    <>
                                      <button
                                        onClick={() => handleTestKey(provider.id)}
                                        disabled={isTesting}
                                        className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5"
                                      >
                                        {isTesting ? (
                                          <ArrowCounterClockwise size={12} className="animate-spin" />
                                        ) : (
                                          <Lightning size={12} />
                                        )}
                                        {isTesting ? 'Testing...' : 'Test'}
                                      </button>
                                      <button
                                        onClick={() => {
                                          setEditingKey(provider.id);
                                          setKeyInput(existingKey.apiKey);
                                        }}
                                        className="btn-secondary text-xs px-2.5 py-1.5"
                                        aria-label="Edit"
                                      >
                                        <PencilSimple size={14} />
                                      </button>
                                      <button
                                        onClick={() => handleRemoveKey(provider.id)}
                                        className="text-red-500 hover:bg-red-500/10 text-xs px-2.5 py-1.5 rounded-lg transition-colors"
                                        aria-label="Remove"
                                      >
                                        <Trash size={14} />
                                      </button>
                                    </>
                                  )}
                                  {!existingKey && (
                                    <button
                                      onClick={() => {
                                        setEditingKey(provider.id);
                                        setKeyInput('');
                                      }}
                                      className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5"
                                    >
                                      <Key size={12} />
                                      Add Key
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </div>

                          {result && !isEditing && (
                            <div
                              className={`mt-2 ml-6 flex items-center gap-2 text-xs font-medium ${
                                result === 'success' ? 'text-emerald-600' : 'text-red-500'
                              }`}
                            >
                              {result === 'success' ? (
                                <>
                                  <CheckCircle size={14} /> API key format is valid
                                </>
                              ) : (
                                <>
                                  <XCircle size={14} /> Invalid key format — check and try again
                                </>
                              )}
                            </div>
                          )}

                          {isEditing && (
                            <div className="mt-3 ml-6 flex items-center gap-2">
                              <div className="relative flex-1 max-w-md">
                                <input
                                  type={isVisible ? 'text' : 'password'}
                                  value={keyInput}
                                  onChange={e => setKeyInput(e.target.value)}
                                  placeholder="Enter API key..."
                                  className={keyInputStyles}
                                  autoFocus
                                  onKeyDown={e => {
                                    if (e.key === 'Enter') handleSaveKey(provider.id);
                                    if (e.key === 'Escape') {
                                      setEditingKey(null);
                                      setKeyInput('');
                                    }
                                  }}
                                />
                                <button
                                  onClick={() => setShowKey(p => ({ ...p, [provider.id]: !p[provider.id] }))}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  {isVisible ? <EyeSlash size={16} /> : <Eye size={16} />}
                                </button>
                              </div>
                              <button
                                onClick={() => handleSaveKey(provider.id)}
                                className="btn-primary text-xs px-3 py-2.5 flex items-center gap-1.5"
                              >
                                <FloppyDisk size={12} />
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingKey(null);
                                  setKeyInput('');
                                }}
                                className="btn-secondary text-xs px-3 py-2.5"
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <div className="rounded-2xl border border-border bg-card px-5 py-4 flex items-start gap-3">
              <Info size={18} weight="duotone" className="text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground">All API keys are stored locally</strong> in your
                browser's localStorage. They never leave your device unless you use a cloud provider
                tool. Local providers like Tesseract.js, Canvas API, and FFmpeg.wasm require no keys
                at all.
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Provider Selection ── */}
        {activeTab === 'selection' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 flex-wrap">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-muted text-muted-foreground hover:bg-border hover:text-foreground'
                  }`}
                >
                  <span>{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {catProviders.map(provider => {
                const defaultP = getDefaultProvider(selectedCategory);
                const isDefault = provider.id === defaultP.id;

                return (
                  <div
                    key={provider.id}
                    className={`rounded-2xl border bg-card p-5 transition-all ${
                      isDefault ? 'border-primary/40 ring-1 ring-primary/10' : 'border-border'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        {provider.type === 'local' ? (
                          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <Desktop size={16} weight="duotone" className="text-emerald-500" />
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <Cloud size={16} weight="duotone" className="text-blue-500" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-sm text-foreground">{provider.name}</div>
                          <div className="text-xs text-muted-foreground">{provider.type === 'local' ? 'Free · Local' : 'Paid · Cloud'}</div>
                        </div>
                      </div>
                      {isDefault && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {provider.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Tab: Usage Stats ── */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Active Providers', value: activeCount, icon: CheckCircle, color: 'text-emerald-500' },
                { label: 'Total Requests', value: totalRequests, icon: Lightning, color: 'text-amber-500' },
                { label: 'Failed Requests', value: totalFailures, icon: XCircle, color: 'text-red-500' },
                { label: 'Avg Processing', value: `${avgTime}ms`, icon: ChartBar, color: 'text-blue-500' },
              ].map(card => (
                <div
                  key={card.label}
                  className="rounded-2xl border border-border bg-card p-5"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <card.icon size={16} weight="duotone" className={card.color} />
                    <span className="text-xs text-muted-foreground font-medium">{card.label}</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">{card.value}</div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h3 className="font-semibold text-foreground">Per-Provider Statistics</h3>
              </div>
              {stats.length === 0 ? (
                <div className="px-5 py-12 text-center text-muted-foreground text-sm">
                  <ChartBar size={32} weight="duotone" className="mx-auto mb-3 opacity-30" />
                  No usage data yet. Use a provider tool to start recording stats.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="px-5 py-3 font-medium text-muted-foreground">Provider</th>
                        <th className="px-5 py-3 font-medium text-muted-foreground text-right">Requests</th>
                        <th className="px-5 py-3 font-medium text-muted-foreground text-right">Failures</th>
                        <th className="px-5 py-3 font-medium text-muted-foreground text-right">Avg Time</th>
                        <th className="px-5 py-3 font-medium text-muted-foreground">Last Used</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {stats.map(s => {
                        const p = allProviders.find(x => x.id === s.providerId);
                        return (
                          <tr key={s.providerId} className="hover:bg-muted/50 transition-colors">
                            <td className="px-5 py-3">
                              <div className="font-medium text-foreground">{p?.name ?? s.providerId}</div>
                              <div className="text-xs text-muted-foreground">{p?.category}</div>
                            </td>
                            <td className="px-5 py-3 text-right font-mono text-foreground">{s.requests}</td>
                            <td className="px-5 py-3 text-right font-mono">
                              <span className={s.failures > 0 ? 'text-red-500' : 'text-muted-foreground'}>
                                {s.failures}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-right font-mono text-foreground">{s.avgTimeMs}ms</td>
                            <td className="px-5 py-3 text-xs text-muted-foreground">
                              {s.lastUsed ? new Date(s.lastUsed).toLocaleString() : '—'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Tab: Global Settings ── */}
        {activeTab === 'global' && (
          <div className="space-y-6 max-w-2xl">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Shield size={20} weight="duotone" className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Global Configuration</h3>
                  <p className="text-xs text-muted-foreground">System-wide settings for all providers</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Maintenance Mode */}
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <div className="text-sm font-medium text-foreground">Maintenance Mode</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Disable all cloud providers temporarily
                    </div>
                  </div>
                  <button
                    onClick={() => handleGlobalChange('maintenanceMode', !globalSettings.maintenanceMode)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      globalSettings.maintenanceMode ? 'bg-primary' : 'bg-muted border border-border'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                        globalSettings.maintenanceMode ? 'translate-x-5' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Rate Limit */}
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <div className="text-sm font-medium text-foreground">Rate Limit</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Maximum API requests per minute
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={globalSettings.rateLimit}
                      onChange={e => handleGlobalChange('rateLimit', parseInt(e.target.value) || 60)}
                      className="w-20 px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm text-right font-mono focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      min={1}
                      max={1000}
                    />
                    <span className="text-xs text-muted-foreground">/min</span>
                  </div>
                </div>

                {/* Max Upload Size */}
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <div className="text-sm font-medium text-foreground">Max Upload Size</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Maximum file size for processing
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={globalSettings.maxUploadSize}
                      onChange={e => handleGlobalChange('maxUploadSize', parseInt(e.target.value) || 50)}
                      className="w-20 px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm text-right font-mono focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      min={1}
                      max={500}
                    />
                    <span className="text-xs text-muted-foreground">MB</span>
                  </div>
                </div>

                {/* Default Provider */}
                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="text-sm font-medium text-foreground">Default Provider</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Fallback provider when none is selected
                    </div>
                  </div>
                  <select
                    value={globalSettings.defaultProvider}
                    onChange={e => handleGlobalChange('defaultProvider', e.target.value)}
                    className="px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none appearance-none cursor-pointer min-w-[180px]"
                  >
                    {allProviders
                      .filter(p => p.type === 'local')
                      .map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card px-5 py-4 flex items-start gap-3">
              <Warning size={18} weight="duotone" className="text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground">These settings are stored locally</strong> and
                apply only to your browser. Global settings that affect all users require server-side
                configuration.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
