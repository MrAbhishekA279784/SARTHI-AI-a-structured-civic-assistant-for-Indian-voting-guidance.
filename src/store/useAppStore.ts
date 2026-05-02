import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createUserSlice, UserSlice } from './slices/userSlice';
import { createJourneySlice, JourneySlice } from './slices/journeySlice';
import { createScenarioSlice, ScenarioSlice } from './slices/scenarioSlice';
import { createUiSlice, UiSlice } from './slices/uiSlice';
import { createReminderSlice, ReminderSlice } from './slices/reminderSlice';

type StoreState = UserSlice & JourneySlice & ScenarioSlice & UiSlice & ReminderSlice & { resetStore: () => void };

export const useAppStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createUserSlice(...a),
      ...createJourneySlice(...a),
      ...createScenarioSlice(...a),
      ...createUiSlice(...a),
      ...createReminderSlice(...a),
      resetStore: () => {
        localStorage.removeItem('votesmart-storage');
        window.location.reload();
      },
    }),
    {
      name: 'votesmart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        profile: state.profile,
        steps: state.steps,
        history: state.history,
        reminders: state.reminders,
        language: state.language,
      }),
    }
  )
);
