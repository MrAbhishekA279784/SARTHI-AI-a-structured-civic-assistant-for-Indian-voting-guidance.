export type TabType = 'home' | 'journey' | 'whatif' | 'checklists' | 'profile';
export type DeviceType = 'mobile' | 'desktop';

export interface CachedBooth {
  id: string;
  userId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  distance?: string;
  note?: string;
  cachedAt: number;
}

export interface Reminder {
  id: string;
  userId: string;
  title: string;
  date: string;          // ISO date: "2026-05-03"
  description: string;
  type: 'registration_deadline' | 'correction_deadline' | 'mock_polling' | 'election_day';
  addedToCalendar: boolean;
  status: 'upcoming' | 'completed';
}

export interface SyncQueueItem {
  id: string;
  collection: string;    // Firestore collection path
  docId: string;
  operation: 'set' | 'update' | 'delete';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
  createdAt: number;
  retries: number;
}
