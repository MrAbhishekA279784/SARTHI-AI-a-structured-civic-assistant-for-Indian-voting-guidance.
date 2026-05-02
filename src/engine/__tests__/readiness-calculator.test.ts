import { describe, it, expect } from 'vitest';
import { calculateReadiness } from '../readiness-calculator';
import { JourneyStep } from '@/types/journey';

describe('Readiness Calculator', () => {
  it('returns 0 for empty journey', () => {
    const result = calculateReadiness({
      steps: [],
      boothLocated: false,
      remindersSet: false,
    });
    expect(result.score).toBe(0);
    expect(result.level).toBe('low');
  });

  it('calculates score properly with partial steps', () => {
    const mockSteps: JourneyStep[] = [
      {
        id: 'step_2_register',
        userId: 'u1',
        order: 2,
        title: 'Register',
        description: '',
        status: 'in_progress',
        checklistItems: [
          { id: '1', label: '', checked: true },
          { id: '2', label: '', checked: false },
        ],
        trustSource: '',
        trustConfidence: 'high',
        trustLastUpdated: ''
      }
    ];

    const result = calculateReadiness({
      steps: mockSteps,
      boothLocated: true, // 15 points
      remindersSet: false,
    });
    
    // Register is weight 25, 1/2 complete = 12.5 -> rounded to 13? Math.round(25 * 0.5) = 13. Booth is 15. Total = 28
    expect(result.score).toBe(28); 
    expect(result.level).toBe('low');
  });
});
