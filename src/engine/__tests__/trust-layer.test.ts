import { describe, it, expect } from 'vitest';
import { getTrust } from '../trust-layer';

describe('Trust Layer', () => {
  it('returns high confidence for journey', () => {
    const trust = getTrust('journey');
    expect(trust.confidence).toBe('high');
    expect(trust.source).toContain('Election Commission');
  });

  it('returns medium confidence for AI scenario', () => {
    const trust = getTrust('scenario_ai');
    expect(trust.confidence).toBe('medium');
    expect(trust.source).toContain('AI-generated');
  });
});
