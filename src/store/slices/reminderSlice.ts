import { StateCreator } from 'zustand';

export interface Reminder {
  id: string;
  title: string;
  date: string;
  description?: string;
  type: 'registration_deadline' | 'election_day' | 'custom';
  completed: boolean;
  time?: string;
  createdAt: number;
}

export interface ReminderSlice {
  reminders: Reminder[];
  addReminder: (reminder: Omit<Reminder, 'id' | 'createdAt'>) => void;
  toggleReminder: (id: string) => void;
  deleteReminder: (id: string) => void;
}

export const createReminderSlice: StateCreator<ReminderSlice> = (set) => ({
  reminders: [],
  addReminder: (reminder) =>
    set((state) => ({
      reminders: [
        ...state.reminders,
        {
          ...reminder,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
        },
      ],
    })),
  toggleReminder: (id) =>
    set((state) => ({
      reminders: state.reminders.map((r) =>
        r.id === id ? { ...r, completed: !r.completed } : r
      ),
    })),
  deleteReminder: (id) =>
    set((state) => ({
      reminders: state.reminders.filter((r) => r.id !== id),
    })),
});
