import { StateCreator } from 'zustand';
import { UserProfile } from '@/types/user';

export interface UserSlice {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  clearProfile: () => void;
}

export const createUserSlice: StateCreator<UserSlice> = (set) => ({
  profile: null,
  setProfile: (profile) => {
    set({ profile });
    // Fire-and-forget sync to Firebase
    if (typeof window !== 'undefined') {
      import('@/lib/sync').then(({ addToSyncQueue }) => {
        addToSyncQueue('set', 'users', profile.id || 'default', profile).catch(console.error);
      }).catch(() => {});
    }
  },
  clearProfile: () => set({ profile: null }),
});
