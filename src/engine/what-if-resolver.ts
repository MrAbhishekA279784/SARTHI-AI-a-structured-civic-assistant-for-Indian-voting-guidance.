import scenariosData from './data/scenarios.json';
import { ScenarioResult, ScenarioData } from '@/types/scenario';

export function normalize(text: string): string {
  return text.toLowerCase().trim().replace(/[^\w\s]/gi, '');
}

export function tokenize(text: string): string[] {
  return normalize(text).split(/\s+/).filter(Boolean);
}

export function getScore(queryTokens: string[], keywords: string[]): number {
  if (!keywords || keywords.length === 0) return 0;
  
  const matchCount = keywords.filter(k => {
    const normK = normalize(k);
    return queryTokens.some(token => {
      if (token === normK) return true;
      if (token.length >= 4 && normK.includes(token)) return true;
      if (normK.length >= 4 && token.includes(normK)) return true;
      return false;
    });
  }).length;
  
  return matchCount / keywords.length;
}

export function findBestMatch(query: string): ScenarioData | null {
  const queryTokens = tokenize(query);
  let best: ScenarioData | null = null;
  let highest = 0;

  for (const item of scenariosData as ScenarioData[]) {
    for (const trigger of item.triggers) {
      const triggerTokens = tokenize(trigger);
      const stopWords = new Set(['i', 'a', 'an', 'the', 'is', 'am', 'are', 'my', 'in', 'to', 'do', 'can', 'how', 'what', 'for', 'of', 'do']);
      const meaningfulTriggerTokens = triggerTokens.filter(w => !stopWords.has(w));
      
      const score = getScore(queryTokens, meaningfulTriggerTokens);
      
      if (score > highest) {
        highest = score;
        best = item;
      }
    }
  }

  return highest > 0.2 ? best : null;
}

export function fallbackAI(query: string) {
  return {
    explanation: "Please verify from official ECI sources.",
    steps: [
      "Visit NVSP website",
      "Check voter information",
      "Contact local election office"
    ],
    source: "ECI",
    confidence: "low"
  };
}

export function resolveQuery(query: string) {
  const match = findBestMatch(query);
  if (match) {
    return match.answer;
  }
  return fallbackAI(query);
}

export function resolveScenario(query: string): Omit<ScenarioResult, 'id' | 'userId' | 'createdAt'> {
  const normalized = query.toLowerCase().trim();
  
  // Exact key match (from dropdown or programmatic calls)
  const exact = (scenariosData as ScenarioData[]).find(s => s.key === normalized);
  if (exact) return formatResult(exact, 'rules', query);
  
  const match = findBestMatch(query);
  
  if (match) {
    return formatResult(match, 'rules', query);
  }
  
  const aiResult = fallbackAI(query);
  
  return {
    scenarioKey: 'unknown',
    query,
    answer: aiResult.explanation,
    steps: aiResult.steps as string[],
    documents: [],
    links: [
      { label: 'Election Commission of India', url: 'https://eci.gov.in' },
      { label: 'National Voters Service Portal', url: 'https://voters.eci.gov.in' }
    ],
    trustSource: 'Election Commission of India (fallback)',
    trustConfidence: 'low',
    trustLastUpdated: 'N/A',
    source: 'rules',
  };
}

function formatResult(scenario: ScenarioData, source: 'rules' | 'ai', originalQuery: string): Omit<ScenarioResult, 'id' | 'userId' | 'createdAt'> {
  return {
    scenarioKey: scenario.key,
    query: originalQuery,
    answer: scenario.answer,
    steps: scenario.steps || [],
    documents: scenario.alternateDocuments || [],
    links: scenario.links || [],
    trustSource: scenario.trust.source,
    trustConfidence: scenario.trust.confidence,
    trustLastUpdated: scenario.trust.lastUpdated,
    source,
  };
}
