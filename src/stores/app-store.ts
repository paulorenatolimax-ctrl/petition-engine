import { create } from 'zustand';

interface AppState {
  // Global Selection
  selectedClientId: string | null;
  setSelectedClient: (id: string | null) => void;

  // Sidebar Layout
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // Generation Queue
  queueCount: number;
  setQueueCount: (n: number) => void;

  // Pending Errors
  pendingErrorsCount: number;
  setPendingErrorsCount: (n: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedClientId: null,
  setSelectedClient: (id) => set({ selectedClientId: id }),

  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  queueCount: 0,
  setQueueCount: (n) => set({ queueCount: n }),

  pendingErrorsCount: 0,
  setPendingErrorsCount: (n) => set({ pendingErrorsCount: n }),
}));
