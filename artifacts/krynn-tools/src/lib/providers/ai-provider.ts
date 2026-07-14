import { getApiKey, getToolProviderSelection, recordProviderRequest } from './settings';
import { getDefaultProvider } from './registry';

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIResponse {
  text: string;
  provider: string;
  tokens?: number;
}

async function callOpenAI(messages: AIMessage[], apiKey: string, opts: { temperature?: number; maxTokens?: number }): Promise<AIResponse> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages,
      temperature: opts.temperature ?? 0.7,
      max_tokens: opts.maxTokens ?? 2048,
    }),
  });
  if (!res.ok) throw new Error(`OpenAI API error: ${res.status}`);
  const data = await res.json();
  return {
    text: data.choices[0].message.content,
    provider: 'openai',
    tokens: data.usage?.total_tokens,
  };
}

async function callAnthropic(messages: AIMessage[], apiKey: string, opts: { temperature?: number; maxTokens?: number }): Promise<AIResponse> {
  const systemMsg = messages.find(m => m.role === 'system');
  const nonSystem = messages.filter(m => m.role !== 'system');
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: opts.maxTokens ?? 2048,
      temperature: opts.temperature ?? 0.7,
      system: systemMsg?.content ?? '',
      messages: nonSystem.map(m => ({ role: m.role, content: m.content })),
    }),
  });
  if (!res.ok) throw new Error(`Anthropic API error: ${res.status}`);
  const data = await res.json();
  return {
    text: data.content[0].text,
    provider: 'anthropic',
    tokens: data.usage ? data.usage.input_tokens + data.usage.output_tokens : undefined,
  };
}

async function callGemini(messages: AIMessage[], apiKey: string, opts: { temperature?: number; maxTokens?: number }): Promise<AIResponse> {
  const contents = messages
    .filter(m => m.role !== 'system')
    .map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));
  const systemMsg = messages.find(m => m.role === 'system');
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        ...(systemMsg ? { systemInstruction: { parts: [{ text: systemMsg.content }] } } : {}),
        generationConfig: {
          temperature: opts.temperature ?? 0.7,
          maxOutputTokens: opts.maxTokens ?? 2048,
        },
      }),
    }
  );
  if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
  const data = await res.json();
  return {
    text: data.candidates[0].content.parts[0].text,
    provider: 'google-gemini',
    tokens: data.usageMetadata?.totalTokenCount,
  };
}

async function callOllama(messages: AIMessage[], opts: { temperature?: number; maxTokens?: number }): Promise<AIResponse> {
  const res = await fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3',
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      options: {
        temperature: opts.temperature ?? 0.7,
        num_predict: opts.maxTokens ?? 2048,
      },
      stream: false,
    }),
  });
  if (!res.ok) throw new Error(`Ollama error: ${res.status}`);
  const data = await res.json();
  return {
    text: data.message?.content ?? '',
    provider: 'ollama',
  };
}

export async function generateAIResponse(
  messages: AIMessage[],
  options?: { temperature?: number; maxTokens?: number; provider?: string }
): Promise<AIResponse> {
  const providerId = options?.provider ?? (getToolProviderSelection('ai') || getDefaultProvider('ai').id);
  const opts = { temperature: options?.temperature, maxTokens: options?.maxTokens };
  const start = performance.now();

  try {
    let result: AIResponse;

    switch (providerId) {
      case 'openai': {
        const key = getApiKey('openai');
        if (!key) throw new Error('No OpenAI API key configured');
        result = await callOpenAI(messages, key, opts);
        break;
      }
      case 'anthropic': {
        const key = getApiKey('anthropic');
        if (!key) throw new Error('No Anthropic API key configured');
        result = await callAnthropic(messages, key, opts);
        break;
      }
      case 'google-gemini': {
        const key = getApiKey('google-gemini');
        if (!key) throw new Error('No Gemini API key configured');
        result = await callGemini(messages, key, opts);
        break;
      }
      case 'ollama':
        result = await callOllama(messages, opts);
        break;
      default:
        throw new Error(`Unsupported AI provider: ${providerId}`);
    }

    recordProviderRequest(providerId, true, performance.now() - start);
    return result;
  } catch (err) {
    recordProviderRequest(providerId, false, performance.now() - start);
    throw err;
  }
}
