import { useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { TerrainLayer as TerrainLayerType, ViewMode } from '@/types/terrain';

interface TerrainLayerProps {
  layer: TerrainLayerType;
  index: number;
  isSelected: boolean;
  onClick: () => void;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  viewMode: ViewMode;
  // New interactive visualization props
  wireframe?: boolean;
  opacity?: number;
  materialScale?: number;
  colorEmphasis?: boolean;
  heightScale?: number;
  colorByProperty?: string;
}

export default function TerrainLayer({ 
  layer, 
  index, 
  isSelected, 
  onClick, 
  dimensions,
  viewMode,
  // Destructure new visualization props with defaults
  wireframe = false,
  opacity,
  materialScale = 1,
  colorEmphasis = false,
  heightScale = 1,
  colorByProperty
}: TerrainLayerProps) {
  // Load texture based on layer material
  const textureMap: Record<string, string> = {
    'rock': '/textures/asphalt.png',
    'sand': '/textures/sand.jpg',
    'soil': '/textures/grass.png',
    'clay': '/textures/wood.jpg',
    'default': '/textures/asphalt.png'
  };
  
  // Select texture path based on material or use default
  const texturePath = textureMap[layer.material] || textureMap['default'];
  const texture = useTexture(texturePath);
  
  // Calculate layer position
  const position = useMemo(() => {
    const totalThickness = layer.depth + layer.thickness / 2;
    return [0, -totalThickness, 0];
  }, [layer.depth, layer.thickness]);
  
  // Get material properties based on view mode and interactive props
  const getMaterialProps = () => {
    // Base color from layer
    const color = new THREE.Color(layer.color);
    const emissiveIntensity = isSelected ? 0.2 : 0.0;
    const emissive = isSelected ? new THREE.Color(layer.color).multiplyScalar(emissiveIntensity) : undefined;
    
    // Apply color emphasis effect if enabled
    const appliedColor = colorEmphasis 
      ? new THREE.Color(color).offsetHSL(0, 0.2, 0.1) 
      : color;
      
    // Determine opacity value (use provided one or default from layer/view mode)
    const appliedOpacity = typeof opacity !== 'undefined' 
      ? opacity 
      : layer.opacity;
      
    // Apply property-based coloring
    const getPropertyBasedColor = () => {
      if (!colorByProperty) {
        return appliedColor;
      }
      
      switch (colorByProperty) {
        case 'density': {
          // Color based on layer density
          if (layer.metadata.density < 2) {
            return new THREE.Color('#4682B4');
          } else if (layer.metadata.density < 3) {
            return new THREE.Color('#6A5ACD');
          } else if (layer.metadata.density < 4) {
            return new THREE.Color('#9370DB');
          } else {
            return new THREE.Color('#8A2BE2');
          }
        }
        case 'porosity': {
          // Color based on layer porosity
          if (layer.metadata.porosity < 0.2) {
            return new THREE.Color('#8B4513');  // Low porosity (brown)
          } else if (layer.metadata.porosity < 0.4) {
            return new THREE.Color('#CD853F');  // Medium-low (tan)
          } else if (layer.metadata.porosity < 0.6) {
            return new THREE.Color('#DAA520');  // Medium (goldenrod)
          } else {
            return new THREE.Color('#F0E68C');  // High porosity (khaki)
          }
        }
        case 'permeability': {
          // Color based on layer permeability
          if (layer.metadata.permeability < 0.1) {
            return new THREE.Color('#556B2F');  // Low permeability (olive)
          } else if (layer.metadata.permeability < 0.3) {
            return new THREE.Color('#6B8E23');  // Medium-low
          } else if (layer.metadata.permeability < 0.5) {
            return new THREE.Color('#9ACD32');  // Medium
          } else {
            return new THREE.Color('#ADFF2F');  // High permeability
          }
        }
        default:
          return appliedColor;
      }
    };
    
    // Modify appearance based on view mode
    switch (viewMode.type) {
      case 'xray':
        return {
          color: getPropertyBasedColor(),
          transparent: true,
          opacity: opacity !== undefined ? opacity : 0.6,
          wireframe: wireframe !== undefined ? wireframe : true,
          emissive: emissive,
          emissiveIntensity: emissiveIntensity * materialScale,
          emissiveMap: isSelected ? texture : undefined
        };
        
      case 'composition': {
        // In composition mode, use color based on layer material
        let materialColor;
        
        if (layer.material === 'rock') {
          materialColor = new THREE.Color('#8B4513');
        } else if (layer.material === 'sand') {
          materialColor = new THREE.Color('#F4A460');
        } else if (layer.material === 'soil') {
          materialColor = new THREE.Color('#556B2F');
        } else if (layer.material === 'clay') {
          materialColor = new THREE.Color('#CD853F');
        } else {
          materialColor = appliedColor;
        }
        
        // If there's a colorByProperty, override the material-based color
        if (colorByProperty) {
          materialColor = getPropertyBasedColor();
        }
        
        return {
          color: materialColor,
          transparent: true,
          opacity: opacity !== undefined ? opacity : 0.8,
          wireframe: wireframe,
          roughness: 0.7 / materialScale,
          metalness: 0.1 * materialScale,
          map: texture,
          emissive: emissive,
          emissiveIntensity: emissiveIntensity * materialScale,
          emissiveMap: isSelected ? texture : undefined
        };
      }
        
      case 'density': {
        // In density mode, use color based on layer density or specified property
        const densityColor = getPropertyBasedColor();
        
        return {
          color: densityColor,
          transparent: true,
          opacity: opacity !== undefined ? opacity : 0.7,
          wireframe: wireframe,
          roughness: 0.5 / materialScale,
          metalness: 0.3 * materialScale,
          emissive: emissive,
          emissiveIntensity: emissiveIntensity * materialScale,
          emissiveMap: isSelected ? texture : undefined
        };
      }
        
      default:
        return {
          color: getPropertyBasedColor(),
          transparent: true,
          opacity: appliedOpacity,
          wireframe: wireframe,
          roughness: 0.6 / materialScale,
          metalness: 0.1 * materialScale,
          map: texture,
          emissive: emissive,
          emissiveIntensity: emissiveIntensity * materialScale,
          emissiveMap: isSelected ? texture : undefined
        };
    }
  };
  
  const materialProps = getMaterialProps();
  
  return (
    <mesh 
      position={position as [number, number, number]} 
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      receiveShadow
      castShadow
    >
      <boxGeometry args={[dimensions.width, layer.thickness, dimensions.depth]} />
      <meshStandardMaterial {...materialProps} />
    </mesh>
  );
}