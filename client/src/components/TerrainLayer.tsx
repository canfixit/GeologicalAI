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
}

export default function TerrainLayer({ 
  layer, 
  index, 
  isSelected, 
  onClick, 
  dimensions,
  viewMode
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
  
  // Get material properties based on view mode
  const getMaterialProps = () => {
    // Base color from layer
    const color = new THREE.Color(layer.color);
    const emissive = isSelected ? new THREE.Color(layer.color).multiplyScalar(0.2) : undefined;
    
    // Modify appearance based on view mode
    switch (viewMode.type) {
      case 'xray':
        return {
          color: color,
          transparent: true,
          opacity: 0.6,
          wireframe: true,
          emissive: emissive,
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
          materialColor = color;
        }
        
        return {
          color: materialColor,
          transparent: true,
          opacity: 0.8,
          roughness: 0.7,
          metalness: 0.1,
          map: texture,
          emissive: emissive,
          emissiveMap: isSelected ? texture : undefined
        };
      }
        
      case 'density': {
        // In density mode, use color based on layer density
        let densityColor;
        if (layer.metadata.density < 2) {
          densityColor = new THREE.Color('#4682B4');
        } else if (layer.metadata.density < 3) {
          densityColor = new THREE.Color('#6A5ACD');
        } else if (layer.metadata.density < 4) {
          densityColor = new THREE.Color('#9370DB');
        } else {
          densityColor = new THREE.Color('#8A2BE2');
        }
        
        return {
          color: densityColor,
          transparent: true,
          opacity: 0.7,
          roughness: 0.5,
          metalness: 0.3,
          emissive: emissive,
          emissiveMap: isSelected ? texture : undefined
        };
      }
        
      default:
        return {
          color: color,
          transparent: true,
          opacity: layer.opacity,
          roughness: 0.6,
          metalness: 0.1,
          map: texture,
          emissive: emissive,
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