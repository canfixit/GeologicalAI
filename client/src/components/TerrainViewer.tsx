import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  PerspectiveCamera, 
  OrbitControls, 
  Environment, 
  Stats,
  Html,
  Text
} from '@react-three/drei';
import * as THREE from 'three';
import { useTerrainStore } from '@/lib/stores/useTerrainStore';
import { useUIStore } from '@/lib/stores/useUIStore';
import { apiRequest } from '@/lib/queryClient';
import TerrainLayer from './TerrainLayer';
import TerrainLayerInfo from './TerrainLayerInfo';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { DrillPoint } from '@/types/terrain';

function TerrainScene() {
  const { 
    terrainData, 
    selectedLayerId, 
    selectLayer, 
    cameraPosition, 
    cameraTarget,
    viewMode,
    setInsights,
    setLoadingInsights 
  } = useTerrainStore();
  
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  
  // Update camera when camera position changes in store
  useEffect(() => {
    if (camera && cameraPosition) {
      camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
    }
    if (controlsRef.current && cameraTarget) {
      controlsRef.current.target.set(cameraTarget.x, cameraTarget.y, cameraTarget.z);
    }
  }, [cameraPosition, cameraTarget, camera]);
  
  // Fetch AI insights periodically
  useEffect(() => {
    if (!terrainData) return;
    
    const fetchInsights = async () => {
      try {
        setLoadingInsights(true);
        const res = await apiRequest('GET', '/api/insights', undefined);
        const data = await res.json();
        setInsights(data);
      } catch (error) {
        console.error('Failed to fetch insights:', error);
        toast.error('Failed to fetch AI insights');
      } finally {
        setLoadingInsights(false);
      }
    };
    
    // Fetch insights immediately
    fetchInsights();
    
    // Then fetch every 30 seconds
    const interval = setInterval(fetchInsights, 30000);
    
    return () => clearInterval(interval);
  }, [terrainData, setInsights, setLoadingInsights]);
  
  if (!terrainData) return null;
  
  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1.5} 
        castShadow 
        shadow-mapSize-width={2048} 
        shadow-mapSize-height={2048} 
      />
      
      {/* Camera and Controls */}
      <PerspectiveCamera makeDefault position={[0, 10, 15]} />
      <OrbitControls 
        ref={controlsRef} 
        enableDamping 
        dampingFactor={0.05} 
        rotateSpeed={0.5}
        minDistance={5}
        maxDistance={50}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2 - 0.1}
      />
      
      {/* Environment */}
      <Environment preset="sunset" />
      
      {/* Terrain Group */}
      <group position={[0, 0, 0]}>
        {/* Grid Helper */}
        <gridHelper 
          args={[
            terrainData.dimensions.width, 
            terrainData.dimensions.width / 2,
            '#666666',
            '#444444'
          ]} 
          position={[0, 0.05, 0]}
        />
        
        {/* Terrain Layers */}
        {terrainData.layers.map((layer, index) => (
          layer.visible && (
            <TerrainLayer 
              key={layer.id}
              layer={layer}
              index={index}
              isSelected={layer.id === selectedLayerId}
              onClick={() => selectLayer(layer.id === selectedLayerId ? null : layer.id)}
              dimensions={terrainData.dimensions}
              viewMode={viewMode}
            />
          )
        ))}
        
        {/* Drill Points */}
        {terrainData.drillPoints.map((point) => (
          <DrillPointMarker key={point.id} point={point} />
        ))}
      </group>
      
      {/* Selected Layer Info */}
      {selectedLayerId && (
        <TerrainLayerInfo 
          layer={terrainData.layers.find(l => l.id === selectedLayerId)!}
        />
      )}
    </>
  );
}

// Drill Point Component
function DrillPointMarker({ point }: { point: DrillPoint }) {
  const { x, y, z } = point.position;
  
  return (
    <group position={[x, y, z]}>
      {/* Drill Stem */}
      <mesh position={[0, y / 2, 0]}>
        <cylinderGeometry args={[0.05, 0.05, y, 8]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
      
      {/* Drill Point Marker */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0, 0.2, 0.4, 8]} />
        <meshStandardMaterial color="#ff4500" />
      </mesh>
      
      {/* Drill Point Label */}
      <Html position={[0, 0.6, 0]} center className="drill-annotation">
        <div className="bg-black/70 text-white px-2 py-1 rounded-md text-xs whitespace-nowrap">
          {point.name} ({point.metadata.depth}m)
        </div>
      </Html>
    </group>
  );
}

export default function TerrainViewer() {
  // Fetch terrain data on component mount
  const { setTerrainData, setLoading, setError } = useTerrainStore();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/terrain'],
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
  
  useEffect(() => {
    if (data) {
      setTerrainData(data);
    }
    
    setLoading(isLoading);
    
    if (error) {
      setError((error as Error).message || 'Failed to load terrain data');
    }
  }, [data, isLoading, error, setTerrainData, setLoading, setError]);

  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        gl={{ antialias: true }}
        camera={{ position: [0, 10, 15], fov: 50 }}
      >
        <color attach="background" args={["#111827"]} />
        <Suspense fallback={null}>
          <TerrainScene />
        </Suspense>
        <Stats className="hidden md:block" />
      </Canvas>
    </div>
  );
}
