import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Checkbox
} from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Layers, 
  EyeOff, 
  Eye, 
  Maximize2, 
  ChevronsUp, 
  ChevronsDown,
  RotateCcw,
  Box,
  Droplet,
  Mountain,
  Info,
  Camera,
  Sun
} from "lucide-react";
import { useTerrainStore } from "@/lib/stores/useTerrainStore";
import { useUIStore } from "@/lib/stores/useUIStore";
import { useVisualizationStore } from "@/lib/stores/useVisualizationStore";
import { ViewMode } from "@/types/terrain";

// Define the available view modes
const VIEW_MODES: ViewMode[] = [
  { type: 'default', name: 'Default View' },
  { type: 'xray', name: 'X-Ray View' },
  { type: 'composition', name: 'Composition View' },
  { type: 'density', name: 'Density Analysis' }
];

export default function InteractiveControls() {
  const [expanded, setExpanded] = useState(false);
  const [showControlPanel, setShowControlPanel] = useState(true);
  const [currentTab, setCurrentTab] = useState("layers");

  // Get terrain data and actions from terrain store
  const { 
    terrainData, 
    toggleLayerVisibility, 
    viewMode, 
    setViewMode, 
    resetView,
    selectedLayerId,
    selectLayer
  } = useTerrainStore();
  
  // Get visualization settings and actions from visualization store
  const {
    lightIntensity,
    ambientIntensity,
    verticalExaggeration,
    showLabels,
    showAxes,
    wireframeMode,
    
    // Get setter actions
    setLightIntensity,
    setAmbientIntensity,
    setVerticalExaggeration,
    setShowLabels,
    setShowAxes,
    setWireframeMode,
    resetVisualization
  } = useVisualizationStore();
  
  // Hide controls when user hasn't interacted for a while
  useEffect(() => {
    if (!expanded) return;
    
    const timer = setTimeout(() => {
      setShowControlPanel(false);
    }, 8000);
    
    const handleActivity = () => {
      setShowControlPanel(true);
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
  
  // Handle view mode change
  const handleViewModeChange = (mode: string) => {
    const selectedMode = VIEW_MODES.find(m => m.type === mode);
    if (selectedMode) {
      setViewMode(selectedMode);
    }
  };

  // Handlers that update the visualization store
  const handleExaggerationChange = (value: number[]) => {
    setVerticalExaggeration(value[0]);
  };

  const handleLightIntensityChange = (value: number[]) => {
    setLightIntensity(value[0]);
  };

  const handleAmbientIntensityChange = (value: number[]) => {
    setAmbientIntensity(value[0]);
  };
  
  // Reset both view and visualization settings
  const handleResetAll = () => {
    resetView();
    resetVisualization();
  };

  if (!terrainData) return null;
  
  return (
    <div className={`fixed bottom-5 right-5 z-10 transition-all duration-300 ${expanded ? 'opacity-100' : 'opacity-100'}`}>
      {expanded ? (
        <div className="bg-background/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-border w-72">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-sm">Terrain Controls</h3>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={() => setExpanded(false)}
            >
              <ChevronsDown size={16} />
            </Button>
          </div>
          
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="layers"><Layers size={14} className="mr-1" /> Layers</TabsTrigger>
              <TabsTrigger value="view"><Box size={14} className="mr-1" /> View</TabsTrigger>
              <TabsTrigger value="lighting"><Sun size={14} className="mr-1" /> Lighting</TabsTrigger>
            </TabsList>
            
            <TabsContent value="layers" className="space-y-3">
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {terrainData.layers.map((layer) => (
                  <div key={layer.id} 
                    className={`flex items-center justify-between p-2 rounded-md transition-colors ${selectedLayerId === layer.id ? 'bg-accent/30' : 'hover:bg-accent/10'}`}
                    onClick={() => selectLayer(layer.id)}
                  >
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
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLayerVisibility(layer.id);
                      }}
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
              
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm">Vertical Exaggeration</span>
                <span className="text-xs text-muted-foreground">{verticalExaggeration.toFixed(1)}x</span>
              </div>
              <Slider 
                value={[verticalExaggeration]} 
                min={1} 
                max={5} 
                step={0.1} 
                onValueChange={handleExaggerationChange}
              />
            </TabsContent>
            
            <TabsContent value="view" className="space-y-3">
              <div className="space-y-2">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="viewMode">View Mode</Label>
                  <Select 
                    value={viewMode.type} 
                    onValueChange={handleViewModeChange}
                  >
                    <SelectTrigger id="viewMode">
                      <SelectValue placeholder="Select a view mode" />
                    </SelectTrigger>
                    <SelectContent>
                      {VIEW_MODES.map((mode) => (
                        <SelectItem key={mode.type} value={mode.type}>
                          {mode.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2 mt-3">
                  <Switch 
                    id="showLabels" 
                    checked={showLabels} 
                    onCheckedChange={setShowLabels} 
                  />
                  <Label htmlFor="showLabels">Show Labels</Label>
                </div>
                
                <div className="flex items-center space-x-2 mt-1">
                  <Switch 
                    id="showAxes" 
                    checked={showAxes} 
                    onCheckedChange={setShowAxes} 
                  />
                  <Label htmlFor="showAxes">Show Coordinate Axes</Label>
                </div>
                
                <div className="flex items-center space-x-2 mt-1">
                  <Switch 
                    id="wireframeMode" 
                    checked={wireframeMode} 
                    onCheckedChange={setWireframeMode} 
                  />
                  <Label htmlFor="wireframeMode">Wireframe Mode</Label>
                </div>
                
                <div className="flex flex-col space-y-1 mt-2">
                  <Label htmlFor="colorByProperty">Color By Property</Label>
                  <Select 
                    value={colorByProperty || ''} 
                    onValueChange={(value) => setColorByProperty(value || null)}
                  >
                    <SelectTrigger id="colorByProperty">
                      <SelectValue placeholder="None (use layer colors)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None (use layer colors)</SelectItem>
                      <SelectItem value="density">Density</SelectItem>
                      <SelectItem value="porosity">Porosity</SelectItem>
                      <SelectItem value="permeability">Permeability</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="mt-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={handleResetAll}
                  >
                    <RotateCcw size={14} className="mr-2" /> Reset All Settings
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="lighting" className="space-y-3">
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="mainLight">Main Light</Label>
                    <span className="text-xs text-muted-foreground">{lightIntensity.toFixed(1)}</span>
                  </div>
                  <Slider 
                    id="mainLight"
                    value={[lightIntensity]} 
                    min={0} 
                    max={2} 
                    step={0.1} 
                    onValueChange={handleLightIntensityChange}
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="ambientLight">Ambient Light</Label>
                    <span className="text-xs text-muted-foreground">{ambientIntensity.toFixed(1)}</span>
                  </div>
                  <Slider 
                    id="ambientLight"
                    value={[ambientIntensity]} 
                    min={0} 
                    max={1} 
                    step={0.1} 
                    onValueChange={handleAmbientIntensityChange}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
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
          <Box size={16} className="mr-2" />
          <span>Terrain Controls</span>
          <ChevronsUp size={16} className="ml-2" />
        </Button>
      )}
    </div>
  );
}