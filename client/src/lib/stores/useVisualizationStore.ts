import { create } from 'zustand';

interface VisualizationState {
  // Lighting settings
  lightIntensity: number;
  ambientIntensity: number;
  
  // Display settings
  showAxes: boolean;
  showLabels: boolean;
  wireframeMode: boolean;
  
  // Physical visualization
  verticalExaggeration: number;
  
  // Color modes
  colorByProperty: string | null;
  
  // Actions
  setLightIntensity: (intensity: number) => void;
  setAmbientIntensity: (intensity: number) => void;
  setShowAxes: (show: boolean) => void;
  setShowLabels: (show: boolean) => void;
  setWireframeMode: (enabled: boolean) => void;
  setVerticalExaggeration: (factor: number) => void;
  setColorByProperty: (property: string | null) => void;
  resetVisualization: () => void;
}

// Default values for visualization
const DEFAULT_LIGHT_INTENSITY = 1.5;
const DEFAULT_AMBIENT_INTENSITY = 0.5;
const DEFAULT_VERTICAL_EXAGGERATION = 1.0;

export const useVisualizationStore = create<VisualizationState>((set) => ({
  // Initial state
  lightIntensity: DEFAULT_LIGHT_INTENSITY,
  ambientIntensity: DEFAULT_AMBIENT_INTENSITY,
  showAxes: false,
  showLabels: true,
  wireframeMode: false,
  verticalExaggeration: DEFAULT_VERTICAL_EXAGGERATION,
  colorByProperty: null,
  
  // Actions
  setLightIntensity: (intensity) => set({ lightIntensity: intensity }),
  
  setAmbientIntensity: (intensity) => set({ ambientIntensity: intensity }),
  
  setShowAxes: (show) => set({ showAxes: show }),
  
  setShowLabels: (show) => set({ showLabels: show }),
  
  setWireframeMode: (enabled) => set({ wireframeMode: enabled }),
  
  setVerticalExaggeration: (factor) => set({ verticalExaggeration: factor }),
  
  setColorByProperty: (property) => set({ colorByProperty: property }),
  
  resetVisualization: () => set({
    lightIntensity: DEFAULT_LIGHT_INTENSITY,
    ambientIntensity: DEFAULT_AMBIENT_INTENSITY,
    showAxes: false,
    showLabels: true,
    wireframeMode: false,
    verticalExaggeration: DEFAULT_VERTICAL_EXAGGERATION,
    colorByProperty: null,
  }),
}));