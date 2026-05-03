import { getAnalytics, logEvent } from 'firebase/analytics';
import { app } from './firebase';

export function trackEvent(
  name: string,
  params?: Record<string, string | number | boolean>
): void {
  try {
    if (typeof window === 'undefined') return;
    const analytics = getAnalytics(app);
    logEvent(analytics, name, params);
  } catch {}
}
