import { Html } from '@react-three/drei';
import { TerrainLayer } from '@/types/terrain';

interface TerrainLayerInfoProps {
  layer: TerrainLayer;
}

export default function TerrainLayerInfo({ layer }: TerrainLayerInfoProps) {
  return (
    <Html position={[3, -layer.depth - layer.thickness / 2, 3]} center>
      <div className="layer-info-card p-4 rounded-lg shadow-lg text-white max-w-xs">
        <div className="flex items-center gap-2 mb-3">
          <div 
            className="w-4 h-4 rounded-full flex-shrink-0" 
            style={{ backgroundColor: layer.color }}
          />
          <h3 className="font-semibold text-lg text-outline">{layer.name}</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div className="text-white/80">Depth:</div>
          <div>{layer.depth}m</div>
          
          <div className="text-white/80">Thickness:</div>
          <div>{layer.thickness}m</div>
          
          <div className="text-white/80">Material:</div>
          <div className="capitalize">{layer.material}</div>
          
          <div className="text-white/80">Age:</div>
          <div>{layer.metadata.age}</div>
          
          <div className="text-white/80">Composition:</div>
          <div>{layer.metadata.composition}</div>
          
          <div className="text-white/80">Porosity:</div>
          <div>{layer.metadata.porosity}%</div>
          
          <div className="text-white/80">Permeability:</div>
          <div>{layer.metadata.permeability} mD</div>
          
          <div className="text-white/80">Density:</div>
          <div>{layer.metadata.density} g/cm³</div>
        </div>
      </div>
    </Html>
  );
}
