import { StateCreator } from 'zustand';
import { TabType, DeviceType } from '@/types/common';

export interface UiSlice {
  activeTab: TabType;
  deviceType: DeviceType;
  isOnline: boolean;
  isSidebarOpen: boolean;
  language: 'en' | 'hi';
  setActiveTab: (tab: TabType) => void;
  setDeviceType: (device: DeviceType) => void;
  setOnlineStatus: (status: boolean) => void;
  toggleSidebar: () => void;
  setLanguage: (lang: 'en' | 'hi') => void;
}

export const createUiSlice: StateCreator<UiSlice> = (set) => ({
  activeTab: 'home',
  deviceType: 'desktop',
  isOnline: true,
  isSidebarOpen: false,
  language: 'en',
  setActiveTab: (tab) => set({ activeTab: tab }),
  setDeviceType: (device) => set({ deviceType: device }),
  setOnlineStatus: (status) => set({ isOnline: status }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setLanguage: (lang) => set({ language: lang }),
});
