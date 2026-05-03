import { getApps, getApp } from 'firebase/app';
import { getAnalytics, logEvent, isSupported } from 'firebase/analytics';

export async function trackEvent(
  name: string,
  params?: Record<string, string | number | boolean>
): Promise<void> {
  try {
    if (typeof window === 'undefined') return;
    const supported = await isSupported();
    if (!supported) return;
    const analytics = getAnalytics(getApp());
    logEvent(analytics, name, params);
  } catch {
    // Analytics failure must never crash the app
  }
}
