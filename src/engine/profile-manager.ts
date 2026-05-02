import { UserSegment, UserProfile } from '@/types/user';

export function detectSegment(
  age: number,
  voterStatus: 'registered' | 'not_registered' | 'unknown',
  hasRelocated: boolean
): UserSegment {
  if (hasRelocated) return 'relocated';
  if (voterStatus === 'registered') return 'registered';
  if (age <= 21 && voterStatus === 'not_registered') return 'first_time';
  if (voterStatus === 'not_registered') return 'first_time';
  return 'lapsed'; // voterStatus === 'unknown'
}

export function validateProfile(profile: Partial<UserProfile>): string[] {
  const errors: string[] = [];
  if (!profile.name?.trim()) errors.push('Name is required');
  if (!profile.age || profile.age < 18) errors.push('Must be 18 or older');
  if (!profile.state) errors.push('State is required');
  return errors;
}
