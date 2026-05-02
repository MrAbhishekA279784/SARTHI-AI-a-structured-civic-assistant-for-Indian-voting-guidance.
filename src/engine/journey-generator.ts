import templates from './data/journey-templates.json';
import { JourneyStep } from '@/types/journey';
import { UserSegment } from '@/types/user';

interface JourneyInput {
  userId: string;
  segment: UserSegment;
}

export function generateJourney(input: JourneyInput): JourneyStep[] {
  // Use segment to pick a template. Lapsed gets the same as relocated for now, or just registered?
  // Let's map lapsed to registered or we can just fall back to first_time.
  let key: keyof typeof templates = 'first_time';
  if (input.segment === 'registered' || input.segment === 'lapsed') key = 'registered';
  if (input.segment === 'relocated') key = 'relocated';

  const templateSteps = templates[key] as any[];

  if (!templateSteps) {
    return [];
  }

  return templateSteps.map((t) => ({
    id: t.id,
    userId: input.userId,
    order: t.order,
    title: t.title,
    description: t.description,
    status: t.order === 1 ? 'in_progress' : 'pending',
    checklistItems: t.checklistItems.map((chk: any) => ({
      id: chk.id,
      label: chk.label,
      checked: false,
    })),
    trustSource: t.trustSource || 'ECI Default',
    trustConfidence: 'high',
    trustLastUpdated: new Date().toISOString().split('T')[0],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }));
}
