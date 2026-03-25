import { create } from 'zustand';

interface AppState {
  selectedClientId: string | null;
  setSelectedClient: (id: string | null) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  queueCount: number;
  setQueueCount: (n: number) => void;
  pendingErrorsCount: number;
  setPendingErrorsCount: (n: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedClientId: null,
  setSelectedClient: (id) => set({ selectedClientId: id }),
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  queueCount: 0,
  setQueueCount: (n) => set({ queueCount: n }),
  pendingErrorsCount: 2,
  setPendingErrorsCount: (n) => set({ pendingErrorsCount: n }),
}));
