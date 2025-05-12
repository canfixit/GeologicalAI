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
  
  // Create material based on view mode
  const material = useMemo(() => {
    // Base color from layer
    const color = new THREE.Color(layer.color);
    
    // Modify appearance based on view mode
    switch (viewMode.type) {
      case 'xray':
        return new THREE.MeshStandardMaterial({
          color,
          transparent: true,
          opacity: 0.6,
          wireframe: true,
        });
        
      case 'composition':
        // In composition mode, use color based on layer material
        const materialColors = {
          'rock': new THREE.Color('#8B4513'),
          'sand': new THREE.Color('#F4A460'),
          'soil': new THREE.Color('#556B2F'),
          'clay': new THREE.Color('#CD853F'),
          'default': color,
        };
        return new THREE.MeshStandardMaterial({
          color: materialColors[layer.material] || materialColors['default'],
          transparent: true,
          opacity: 0.8,
          roughness: 0.7,
          metalness: 0.1,
          map: texture,
        });
        
      case 'density':
        // In density mode, use color based on layer density
        const densityColor = new THREE.Color(
          layer.metadata.density < 2 ? '#4682B4' :
          layer.metadata.density < 3 ? '#6A5ACD' :
          layer.metadata.density < 4 ? '#9370DB' : 
          '#8A2BE2'
        );
        return new THREE.MeshStandardMaterial({
          color: densityColor,
          transparent: true,
          opacity: 0.7,
          roughness: 0.5,
          metalness: 0.3,
        });
        
      default:
        // Default view with texture
        return new THREE.MeshStandardMaterial({
          color,
          transparent: true,
          opacity: layer.opacity,
          roughness: 0.6,
          metalness: 0.1,
          map: texture,
        });
    }
  }, [layer, texture, viewMode]);
  
  // Apply special effects for selected layer
  if (isSelected) {
    material.emissive = new THREE.Color(layer.color).multiplyScalar(0.2);
    material.emissiveMap = texture;
  }
  
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
      {material}
    </mesh>
  );
}
