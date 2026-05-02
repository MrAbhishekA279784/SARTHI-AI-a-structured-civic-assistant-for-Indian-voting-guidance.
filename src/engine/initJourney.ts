import { useAppStore } from '@/store/useAppStore';
import { generateJourney } from '@/engine/journey-generator';

/**
 * Ensures the Zustand journey steps array is never empty.
 * Safe to call multiple times — no-ops if steps already exist.
 * Reads profile from store to determine segment; falls back to 'first_time'.
 */
export function initJourneyIfEmpty(): void {
  const { steps, setSteps, profile } = useAppStore.getState();

  if (steps && steps.length > 0) return;

  const userId = profile?.id || 'anonymous';
  const segment = profile?.segment || 'first_time';

  const generated = generateJourney({ userId, segment });

  if (generated.length > 0) {
    setSteps(generated);
  }
}
