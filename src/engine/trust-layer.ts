import { TrustBadge } from '@/types/scenario';

const TRUST_DEFAULTS: Record<string, TrustBadge> = {
  journey: {
    source: 'Election Commission of India',
    confidence: 'high',
    lastUpdated: '2026-04-20',
  },
  scenario_rules: {
    source: 'Election Commission of India — Handbook for Presiding Officers',
    confidence: 'high',
    lastUpdated: '2026-04-20',
  },
  scenario_ai: {
    source: 'AI-generated based on official election guidelines',
    confidence: 'medium',
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  booth: {
    source: 'Election Commission of India — Booth Level Data',
    confidence: 'high',
    lastUpdated: '2026-04-15',
  },
};

export function getTrust(contentType: keyof typeof TRUST_DEFAULTS): TrustBadge {
  return TRUST_DEFAULTS[contentType];
}
