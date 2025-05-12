import { create } from 'zustand';

export type AppMode = 'landing' | 'viewer';

interface UIState {
  // Application mode state
  appMode: AppMode;
  isDarkMode: boolean;
  sidebarOpen: boolean;
  insightsPanelOpen: boolean;
  showControls: boolean;
  
  // Actions
  setAppMode: (mode: AppMode) => void;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  toggleInsightsPanel: () => void;
  setShowControls: (show: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Initial state
  appMode: 'landing',
  isDarkMode: true, // Start with dark mode by default for better visualization
  sidebarOpen: true,
  insightsPanelOpen: true,
  showControls: true,
  
  // Actions
  setAppMode: (mode) => set({ appMode: mode }),
  
  toggleDarkMode: () => set((state) => ({ 
    isDarkMode: !state.isDarkMode 
  })),
  
  toggleSidebar: () => set((state) => ({ 
    sidebarOpen: !state.sidebarOpen 
  })),
  
  toggleInsightsPanel: () => set((state) => ({ 
    insightsPanelOpen: !state.insightsPanelOpen 
  })),
  
  setShowControls: (show) => set({ 
    showControls: show 
  })
}));
