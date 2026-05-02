import { StateCreator } from 'zustand';
import { JourneyStep } from '@/types/journey';

export interface JourneySlice {
  steps: JourneyStep[];
  currentStepId: string | null;
  setSteps: (steps: JourneyStep[]) => void;
  setCurrentStepId: (stepId: string) => void;
  updateStepStatus: (stepId: string, status: JourneyStep['status']) => void;
  toggleChecklistItem: (stepId: string, itemId: string) => void;
}

function syncStepsToFirebase(steps: JourneyStep[]) {
  if (typeof window === 'undefined') return;
  import('@/lib/sync').then(({ addToSyncQueue }) => {
    // Sync the entire steps array as a single document for simplicity
    addToSyncQueue('set', 'journeySteps', 'current', { steps, updatedAt: Date.now() }).catch(console.error);
  }).catch(() => {});
}

export const createJourneySlice: StateCreator<JourneySlice> = (set, get) => ({
  steps: [],
  currentStepId: null,
  setSteps: (steps) => {
    set({ steps });
    syncStepsToFirebase(steps);
  },
  setCurrentStepId: (currentStepId) => set({ currentStepId }),
  updateStepStatus: (stepId, status) => {
    set((state) => ({
      steps: state.steps.map((step) =>
        step.id === stepId ? { ...step, status } : step
      ),
    }));
    // Debounce sync slightly to batch rapid updates
    setTimeout(() => syncStepsToFirebase(get().steps), 100);
  },
  toggleChecklistItem: (stepId, itemId) => {
    set((state) => ({
      steps: state.steps.map((step) => {
        if (step.id !== stepId) return step;
        return {
          ...step,
          checklistItems: step.checklistItems.map((item) =>
            item.id === itemId
              ? { ...item, checked: !item.checked, checkedAt: !item.checked ? Date.now() : undefined }
              : item
          ),
        };
      }),
    }));
    setTimeout(() => syncStepsToFirebase(get().steps), 100);
  },
});
