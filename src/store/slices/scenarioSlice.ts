import { StateCreator } from 'zustand';
import { ScenarioResult } from '@/types/scenario';

export interface ScenarioSlice {
  history: ScenarioResult[];
  addScenarioResult: (result: ScenarioResult) => void;
  clearHistory: () => void;
}

export const createScenarioSlice: StateCreator<ScenarioSlice> = (set) => ({
  history: [],
  addScenarioResult: (result) =>
    set((state) => ({ history: [result, ...state.history] })),
  clearHistory: () => set({ history: [] }),
});
