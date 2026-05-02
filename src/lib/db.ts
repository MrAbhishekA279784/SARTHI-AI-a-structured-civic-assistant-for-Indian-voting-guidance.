import Dexie, { type Table } from 'dexie';
import { UserProfile } from '@/types/user';
import { JourneyStep } from '@/types/journey';
import { ScenarioResult } from '@/types/scenario';
import { CachedBooth, Reminder, SyncQueueItem } from '@/types/common';

export class VoteSmartDB extends Dexie {
  userProfile!: Table<UserProfile>;
  journeySteps!: Table<JourneyStep>;
  cachedBooth!: Table<CachedBooth>;
  scenarioResults!: Table<ScenarioResult>;
  reminders!: Table<Reminder>;
  syncQueue!: Table<SyncQueueItem>;

  constructor() {
    super('votesmart-db');
    this.version(1).stores({
      userProfile: 'id',
      journeySteps: 'id, userId, order',
      cachedBooth: 'id, userId',
      scenarioResults: 'id, userId, scenarioKey',
      reminders: 'id, userId, date, status',
      syncQueue: 'id, createdAt',
    });
  }
}

export const db = new VoteSmartDB();
