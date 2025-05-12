// Terrain data types
export interface TerrainData {
  id: string;
  name: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  layers: TerrainLayer[];
  drillPoints: DrillPoint[];
}

export interface TerrainLayer {
  id: string;
  name: string;
  depth: number;
  thickness: number;
  color: string;
  material: string;
  opacity: number;
  metadata: LayerMetadata;
  visible: boolean;
}

export interface LayerMetadata {
  age: string;
  composition: string;
  porosity: number;
  permeability: number;
  density: number;
}

export interface DrillPoint {
  id: string;
  name: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  metadata: DrillPointMetadata;
}

export interface DrillPointMetadata {
  date: string;
  depth: number;
  sampleData: string;
}

// AI Insight types
export interface AIInsight {
  id: string;
  timestamp: string;
  type: InsightType;
  location: {
    x: number;
    y: number;
    z: number;
  };
  layerId?: string;
  confidence: number;
  description: string;
  recommendation?: string;
  severity: 'low' | 'medium' | 'high';
}

export enum InsightType {
  ANOMALY = 'anomaly',
  POTENTIAL_RESOURCE = 'potential_resource',
  STRUCTURAL_WEAKNESS = 'structural_weakness',
  DENSITY_VARIATION = 'density_variation',
  FAULT_LINE = 'fault_line'
}

// Camera and controls
export interface CameraPosition {
  x: number;
  y: number;
  z: number;
}

export interface CameraTarget {
  x: number;
  y: number;
  z: number;
}

// User interface state
export interface ViewMode {
  type: 'default' | 'xray' | 'composition' | 'density';
  name: string;
}
