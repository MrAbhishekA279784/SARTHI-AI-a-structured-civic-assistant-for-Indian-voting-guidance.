import { describe, it, expect } from 'vitest';
import { detectSegment, validateProfile } from '../profile-manager';

describe('Profile Manager', () => {
  describe('detectSegment', () => {
    it('detects first_time voter', () => {
      expect(detectSegment(19, 'not_registered', false)).toBe('first_time');
    });

    it('detects registered voter', () => {
      expect(detectSegment(30, 'registered', false)).toBe('registered');
    });

    it('detects relocated voter', () => {
      expect(detectSegment(30, 'registered', true)).toBe('relocated');
    });

    it('detects lapsed voter for unknown status', () => {
      expect(detectSegment(30, 'unknown', false)).toBe('lapsed');
    });
  });

  describe('validateProfile', () => {
    it('returns empty array for valid profile', () => {
      const errors = validateProfile({ name: 'Test', age: 25, state: 'MH' });
      expect(errors.length).toBe(0);
    });

    it('returns errors for missing fields', () => {
      const errors = validateProfile({ name: ' ', age: 17 });
      expect(errors).toContain('Name is required');
      expect(errors).toContain('Must be 18 or older');
      expect(errors).toContain('State is required');
    });
  });
});
