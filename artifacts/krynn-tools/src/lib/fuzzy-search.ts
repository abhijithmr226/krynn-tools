export function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

const SOUNDEX_MAP: Record<string, string> = {
  'b': '1', 'f': '1', 'p': '1', 'v': '1',
  'c': '2', 'g': '2', 'j': '2', 'k': '2', 'q': '2', 's': '2', 'x': '2', 'z': '2',
  'd': '3', 't': '3',
  'l': '4',
  'm': '5', 'n': '5',
  'r': '6',
};

export function soundex(str: string): string {
  const s = str.toLowerCase().replace(/[^a-z]/g, '');
  if (!s) return '';
  const first = s[0].toUpperCase();
  let encoded = first;
  let prevCode = SOUNDEX_MAP[first.toLowerCase()] || '';
  for (let i = 1; i < s.length && encoded.length < 4; i++) {
    const code = SOUNDEX_MAP[s[i]] || '';
    if (code && code !== prevCode) {
      encoded += code;
      prevCode = code;
    }
    if (!code) prevCode = '';
  }
  return encoded.padEnd(4, '0');
}

export function ngramSimilarity(a: string, b: string, n = 2): number {
  const aGrams = new Map<string, number>();
  const bGrams = new Map<string, number>();
  for (let i = 0; i <= a.length - n; i++) {
    const g = a.slice(i, i + n);
    aGrams.set(g, (aGrams.get(g) || 0) + 1);
  }
  for (let i = 0; i <= b.length - n; i++) {
    const g = b.slice(i, i + n);
    bGrams.set(g, (bGrams.get(g) || 0) + 1);
  }
  let intersection = 0;
  let union = 0;
  for (const g of new Set([...aGrams.keys(), ...bGrams.keys()])) {
    intersection += Math.min(aGrams.get(g) || 0, bGrams.get(g) || 0);
    union += Math.max(aGrams.get(g) || 0, bGrams.get(g) || 0);
  }
  return union === 0 ? 0 : intersection / union;
}

export function fuzzyScore(query: string, target: string): number {
  if (!query || !target) return 0;
  if (query === target) return 1.0;
  if (target.startsWith(query)) return 0.9;
  if (target.includes(query)) return 0.85;

  const queryWords = query.split(/\s+/).filter(Boolean);
  const targetWords = target.split(/\s+/).filter(Boolean);

  const allQueryWordsMatchWord = queryWords.length > 0 && queryWords.every(qw =>
    targetWords.some(tw => tw.startsWith(qw) || tw === qw)
  );
  if (allQueryWordsMatchWord) return 0.8;

  const someQueryWordsMatch = queryWords.length > 0 && queryWords.some(qw =>
    targetWords.some(tw => tw.startsWith(qw) || tw === qw || levenshtein(qw, tw) <= 2)
  );
  if (someQueryWordsMatch) return 0.75;

  const levDist = levenshtein(query, target);
  if (levDist <= 1) return 0.65;
  if (levDist <= 2) return 0.6;

  const soundexMatch = query.length >= 3 && target.length >= 3 && soundex(query) === soundex(target);
  if (soundexMatch) return 0.7;

  const ngramSim = ngramSimilarity(query, target);
  if (ngramSim > 0.5) return 0.5;

  const currentCode = SOUNDEX_MAP[query[0]] || '';
  const firstLetterMatch = query[0] === target[0] || (currentCode && SOUNDEX_MAP[target[0]] === currentCode);
  let prefixScore = 0;
  for (let i = 1; i <= Math.min(query.length, target.length); i++) {
    if (query[i - 1] === target[i - 1]) prefixScore = i / query.length;
    else break;
  }
  if (firstLetterMatch && prefixScore > 0.2) return Math.min(0.5, prefixScore * 0.5);

  return 0;
}

export function fuzzyMatch(query: string, target: string, threshold = 0.45): boolean {
  return fuzzyScore(query, target) >= threshold;
}
