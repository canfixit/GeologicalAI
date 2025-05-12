import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { CameraPosition, CameraTarget, TerrainData, TerrainLayer, AIInsight, ViewMode } from '@/types/terrain';

interface TerrainState {
  // Terrain data
  terrainData: TerrainData | null;
  isLoading: boolean;
  error: string | null;
  selectedLayerId: string | null;
  
  // Camera settings
  cameraPosition: CameraPosition;
  cameraTarget: CameraTarget;
  
  // View settings
  viewMode: ViewMode;
  
  // AI Insights
  insights: AIInsight[];
  isLoadingInsights: boolean;
  
  // Actions
  setTerrainData: (data: TerrainData) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  selectLayer: (layerId: string | null) => void;
  toggleLayerVisibility: (layerId: string) => void;
  setCameraPosition: (position: CameraPosition) => void;
  setCameraTarget: (target: CameraTarget) => void;
  setViewMode: (mode: ViewMode) => void;
  setInsights: (insights: AIInsight[]) => void;
  setLoadingInsights: (isLoading: boolean) => void;
  resetView: () => void;
}

// Default camera position and target
const DEFAULT_CAMERA_POSITION = { x: 0, y: 10, z: 15 };
const DEFAULT_CAMERA_TARGET = { x: 0, y: 0, z: 0 };

export const useTerrainStore = create<TerrainState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    terrainData: null,
    isLoading: false,
    error: null,
    selectedLayerId: null,
    
    cameraPosition: DEFAULT_CAMERA_POSITION,
    cameraTarget: DEFAULT_CAMERA_TARGET,
    
    viewMode: { type: 'default', name: 'Default View' },
    
    insights: [],
    isLoadingInsights: false,
    
    // Actions
    setTerrainData: (data) => set({ terrainData: data }),
    
    setLoading: (isLoading) => set({ isLoading }),
    
    setError: (error) => set({ error }),
    
    selectLayer: (layerId) => set({ selectedLayerId: layerId }),
    
    toggleLayerVisibility: (layerId) => {
      const { terrainData } = get();
      if (!terrainData) return;
      
      const updatedLayers = terrainData.layers.map((layer) => {
        if (layer.id === layerId) {
          return { ...layer, visible: !layer.visible };
        }
        return layer;
      });
      
      set({
        terrainData: {
          ...terrainData,
          layers: updatedLayers
        }
      });
    },
    
    setCameraPosition: (position) => set({ cameraPosition: position }),
    
    setCameraTarget: (target) => set({ cameraTarget: target }),
    
    setViewMode: (mode) => set({ viewMode: mode }),
    
    setInsights: (insights) => set({ insights }),
    
    setLoadingInsights: (isLoading) => set({ isLoadingInsights: isLoading }),
    
    resetView: () => set({
      cameraPosition: DEFAULT_CAMERA_POSITION,
      cameraTarget: DEFAULT_CAMERA_TARGET,
      viewMode: { type: 'default', name: 'Default View' }
    })
  }))
);
