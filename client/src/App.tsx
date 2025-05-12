import { useEffect } from "react";
import { useUIStore } from "./lib/stores/useUIStore";
import { useTerrainStore } from "./lib/stores/useTerrainStore";
import Landing from "./components/Landing";
import TerrainViewer from "./components/TerrainViewer";
import Navbar from "./components/Navbar";
import AIInsightsPanel from "./components/AIInsightsPanel";
import Controls from "./components/Controls";
import { Toaster } from "sonner";

function App() {
  const { appMode, isDarkMode, sidebarOpen, insightsPanelOpen, showControls } = useUIStore();
  const { isLoading, error } = useTerrainStore();

  // Set dark mode class on the document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen w-full">
      {/* Toaster for notifications */}
      <Toaster richColors position="top-right" />

      {appMode === 'landing' && <Landing />}

      {appMode === 'viewer' && (
        <div className="flex flex-col h-screen overflow-hidden">
          <Navbar />
          <div className="flex-1 flex overflow-hidden">
            {/* Main 3D Terrain Viewer */}
            <div className="relative flex-1 overflow-hidden">
              <TerrainViewer />

              {/* Show loading overlay if loading */}
              {isLoading && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div className="loading-spinner w-16 h-16 border-4 border-accent border-t-transparent rounded-full mb-4"></div>
                    <p className="text-lg">Loading terrain data...</p>
                  </div>
                </div>
              )}

              {/* Show error message if there's an error */}
              {error && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                  <div className="flex flex-col items-center p-6 max-w-md text-center">
                    <div className="w-16 h-16 text-destructive mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Error Loading Data</h2>
                    <p className="mb-4">{error}</p>
                    <button 
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
                      onClick={() => window.location.reload()}
                    >
                      Retry
                    </button>
                  </div>
                </div>
              )}

              {/* Controls overlay */}
              {showControls && <Controls />}
            </div>

            {/* AI Insights Panel */}
            {insightsPanelOpen && (
              <div className="w-80 bg-sidebar flex-shrink-0 border-l border-sidebar-border overflow-hidden">
                <AIInsightsPanel />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
