import { Moon, Sun, Menu, X, ChevronLeft, RotateCcw, Eye, EyeOff, HelpCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/lib/stores/useUIStore";
import { useTerrainStore } from "@/lib/stores/useTerrainStore";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ViewMode } from "@/types/terrain";

export default function Navbar() {
  const { isDarkMode, toggleDarkMode, sidebarOpen, toggleSidebar, insightsPanelOpen, toggleInsightsPanel } = useUIStore();
  const { viewMode, setViewMode, resetView } = useTerrainStore();

  // Available view modes
  const viewModes: ViewMode[] = [
    { type: 'default', name: 'Standard View' },
    { type: 'xray', name: 'X-Ray View' },
    { type: 'composition', name: 'Composition View' },
    { type: 'density', name: 'Density Analysis' },
  ];

  return (
    <header className="bg-card border-b border-border h-14 flex items-center px-4 justify-between z-10">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="mr-2"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
        
        <div className="flex items-center">
          <span className="font-bold text-xl">GeoSphere</span>
          <span className="text-muted-foreground ml-2 hidden sm:inline">Terrain Visualization</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* View Mode Selector */}
        <div className="hidden md:flex mr-2">
          <select 
            value={viewMode.type}
            onChange={(e) => {
              const selectedMode = viewModes.find(mode => mode.type === e.target.value);
              if (selectedMode) setViewMode(selectedMode);
            }}
            className="bg-secondary text-secondary-foreground px-3 py-1.5 rounded-md text-sm"
          >
            {viewModes.map((mode) => (
              <option key={mode.type} value={mode.type}>
                {mode.name}
              </option>
            ))}
          </select>
        </div>

        <TooltipProvider>
          {/* Reset View */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={resetView}
                aria-label="Reset view"
              >
                <RotateCcw size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reset camera view</p>
            </TooltipContent>
          </Tooltip>

          {/* Toggle AI Insights Panel */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={toggleInsightsPanel}
                aria-label={insightsPanelOpen ? "Hide insights" : "Show insights"}
              >
                {insightsPanelOpen ? <Eye size={18} /> : <EyeOff size={18} />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{insightsPanelOpen ? "Hide" : "Show"} AI insights panel</p>
            </TooltipContent>
          </Tooltip>

          {/* Settings Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                aria-label="Settings"
                className="hidden sm:flex"
              >
                <Settings size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>

          {/* Help Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                aria-label="Help"
                className="hidden sm:flex"
              >
                <HelpCircle size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Help & Documentation</p>
            </TooltipContent>
          </Tooltip>

          {/* Toggle Dark Mode */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={toggleDarkMode}
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle {isDarkMode ? "light" : "dark"} mode</p>
            </TooltipContent>
          </Tooltip>

          {/* Back to Landing Page */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                className="ml-2 hidden sm:flex items-center gap-1" 
                onClick={() => useUIStore.getState().setAppMode('landing')}
                aria-label="Back to home"
              >
                <ChevronLeft size={16} />
                <span>Home</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Return to home page</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  );
}
