import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Layers, 
  EyeOff, 
  Eye, 
  Maximize2, 
  Key, 
  ChevronsUp, 
  ChevronsDown
} from "lucide-react";
import { useTerrainStore } from "@/lib/stores/useTerrainStore";

export default function Controls() {
  const [expanded, setExpanded] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const { terrainData, toggleLayerVisibility } = useTerrainStore();
  
  // Hide controls when user hasn't interacted for a while
  useEffect(() => {
    if (!expanded) return;
    
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 8000);
    
    const handleActivity = () => {
      setShowControls(true);
      clearTimeout(timer);
    };
    
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('keydown', handleActivity);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, [expanded]);
  
  if (!terrainData) return null;
  
  return (
    <div className={`fixed bottom-5 right-5 z-10 transition-all duration-300 ${!showControls && expanded ? 'opacity-30 hover:opacity-100' : 'opacity-100'}`}>
      {expanded ? (
        <div className="bg-background/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-border max-w-xs">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-sm">Layer Controls</h3>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={() => setExpanded(false)}
            >
              <ChevronsDown size={16} />
            </Button>
          </div>
          
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {terrainData.layers.map((layer) => (
              <div key={layer.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: layer.color }}
                  />
                  <span className="text-sm">{layer.name}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7" 
                  onClick={() => toggleLayerVisibility(layer.id)}
                >
                  {layer.visible ? (
                    <Eye size={14} />
                  ) : (
                    <EyeOff size={14} />
                  )}
                </Button>
              </div>
            ))}
          </div>
          
          <div className="border-t border-border mt-3 pt-3">
            <div className="text-xs text-muted-foreground">
              <div className="mb-1 font-medium">Keyboard Controls:</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <div>Pan: Middle mouse</div>
                <div>Rotate: Left mouse</div>
                <div>Zoom: Scroll wheel</div>
                <div>Reset: Double click</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Button 
          variant="secondary" 
          size="sm" 
          className="flex items-center shadow-lg" 
          onClick={() => setExpanded(true)}
        >
          <Layers size={16} className="mr-2" />
          <span>Controls</span>
          <ChevronsUp size={16} className="ml-2" />
        </Button>
      )}
    </div>
  );
}
