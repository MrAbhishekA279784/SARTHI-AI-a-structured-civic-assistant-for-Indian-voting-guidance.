export type UserSegment = 'first_time' | 'registered' | 'relocated' | 'lapsed';

export interface UserProfile {
  id: string;            // UUID, generated on first use
  name: string;
  age: number;
  state: string;         // State code: "MH", "KA", "DL", etc.
  constituency?: string;
  voterStatus: 'registered' | 'not_registered' | 'unknown';
  segment: UserSegment;
  language: 'en' | 'hi';
  isComplete: boolean;
  voterId?: string;
  createdAt: number;     // Unix timestamp
  updatedAt: number;
}
