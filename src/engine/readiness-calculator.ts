import { JourneyStep } from '@/types/journey';

export interface ReadinessInput {
  steps: JourneyStep[];
  boothLocated: boolean;
  remindersSet: boolean;
}

export interface ReadinessOutput {
  score: number;           // 0-100, integer
  level: 'low' | 'medium' | 'high';
  label: string;
  breakdown: ReadinessBreakdown[];
}

export interface ReadinessBreakdown {
  category: string;
  weight: number;          // 0-100 (percentage points)
  completion: number;      // 0-1 (fraction completed)
  earned: number;          // weight × completion
}

const CATEGORY_WEIGHTS: Record<string, number> = {
  'eligibility': 0,
  'register': 25,
  'shift': 25,
  'documents': 20,
  'verify': 20,
  'learn': 10,
  'plan': 0,
  'vote': 0,
};

function extractStepKey(id: string): string {
  // id is like "step_1_eligibility" or "step_2_register"
  const parts = id.split('_');
  return parts.length >= 3 ? parts[2] : parts[parts.length - 1];
}

export function calculateReadiness(input: ReadinessInput): ReadinessOutput {
  const breakdown: ReadinessBreakdown[] = [];

  for (const step of input.steps) {
    const key = extractStepKey(step.id);
    const weight = CATEGORY_WEIGHTS[key] ?? 0;
    if (weight === 0) continue;

    const total = step.checklistItems.length;
    const checked = step.checklistItems.filter(i => i.checked).length;
    const completion = total > 0 ? checked / total : 0;

    breakdown.push({
      category: step.title,
      weight,
      completion,
      earned: Math.round(weight * completion),
    });
  }

  breakdown.push({
    category: 'Polling Booth Located',
    weight: 15,
    completion: input.boothLocated ? 1 : 0,
    earned: input.boothLocated ? 15 : 0,
  });

  breakdown.push({
    category: 'Reminders Set',
    weight: 10,
    completion: input.remindersSet ? 1 : 0,
    earned: input.remindersSet ? 10 : 0,
  });

  const score = Math.min(100, breakdown.reduce((sum, b) => sum + b.earned, 0));
  const level = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';
  const label = level === 'high'
    ? 'You are on the right track!'
    : level === 'medium'
    ? 'Almost there! Keep going.'
    : "Let's get started!";

  return { score, level, label, breakdown };
}
