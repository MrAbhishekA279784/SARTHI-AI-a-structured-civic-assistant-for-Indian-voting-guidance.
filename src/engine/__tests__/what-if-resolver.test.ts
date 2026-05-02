import { describe, it, expect } from 'vitest';
import { resolveScenario } from '../what-if-resolver';
import { askSarthi } from '../sarthi-explainer';

describe('What-if Resolver', () => {
  it('resolves exact key match', () => {
    const result = resolveScenario('lost_voter_id');
    expect(result.scenarioKey).toBe('lost_voter_id');
    expect(result.source).toBe('rules');
  });

  it('resolves keyword match — lost epic', () => {
    const result = resolveScenario('I have my epic card lost');
    expect(result.scenarioKey).toBe('lost_voter_id');
  });

  it('resolves keyword match — online registration', () => {
    const result = resolveScenario('How do I register voter online?');
    expect(result.scenarioKey).toBe('register_online');
  });

  it('resolves keyword match — NRI voting', () => {
    const result = resolveScenario('nri voting india');
    expect(result.scenarioKey).toBe('nri_voting');
  });

  it('resolves keyword match — documents needed', () => {
    const result = resolveScenario('what documents do i need for voting');
    expect(result.scenarioKey).toBe('documents_registration');
  });

  it('resolves keyword match — first time voter', () => {
    const result = resolveScenario('first time voter steps');
    expect(result.scenarioKey).toBe('first_time_voter');
  });

  it('resolves keyword match — shifted city', () => {
    const result = resolveScenario('I moved to new city voting');
    expect(result.scenarioKey).toBe('shifted_city');
  });

  it('returns fallback for unmatched queries', () => {
    const result = resolveScenario('random unknown scenario that should fail');
    expect(result.scenarioKey).toBe('unknown');
    expect(result.trustConfidence).toBe('low');
    expect(result.steps.length).toBeGreaterThan(0);
  });
});

describe('SARTHI Explainer', () => {
  it('returns high confidence for dataset match', () => {
    const response = askSarthi('lost voter id');
    expect(response.confidence).toBe('high');
    expect(response.steps.length).toBeGreaterThan(0);
    expect(response.source).toContain('Election Commission');
  });

  it('returns low confidence for unknown query', () => {
    const response = askSarthi('something completely unknown xyz');
    expect(response.confidence).toBe('low');
    expect(response.steps.length).toBeGreaterThan(0);
  });

  it('includes documents for registration query', () => {
    const response = askSarthi('what documents do i need');
    expect(response.documents).toBeDefined();
    expect(response.documents!.length).toBeGreaterThan(0);
  });

  it('provides contextual note', () => {
    const response = askSarthi('I lost my voter ID');
    expect(response.note).toBeTruthy();
    expect(response.note.length).toBeGreaterThan(0);
  });

  it('provides different explanations for different queries', () => {
    const r1 = askSarthi('lost voter id');
    const r2 = askSarthi('how to register online');
    expect(r1.explanation).not.toBe(r2.explanation);
    expect(r1.steps).not.toEqual(r2.steps);
  });
});
