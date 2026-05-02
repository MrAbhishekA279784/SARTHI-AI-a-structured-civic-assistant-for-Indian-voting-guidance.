import { describe, it, expect } from 'vitest';
import { generateJourney } from '../journey-generator';

describe('Journey Generator', () => {
  it('should generate first_time journey for new users', () => {
    const journey = generateJourney({ userId: 'user-1', segment: 'first_time' });
    expect(journey.length).toBe(2);
    expect(journey[0].title).toBe('Check Eligibility');
    expect(journey[0].status).toBe('in_progress');
    expect(journey[1].status).toBe('pending');
  });

  it('should generate registered journey for existing voters', () => {
    const journey = generateJourney({ userId: 'user-2', segment: 'registered' });
    expect(journey.length).toBe(1);
    expect(journey[0].title).toBe('Verify Name in Roll');
  });

  it('should generate relocated journey for shifted voters', () => {
    const journey = generateJourney({ userId: 'user-3', segment: 'relocated' });
    expect(journey.length).toBe(1);
    expect(journey[0].title).toBe('Update Address');
  });
});
