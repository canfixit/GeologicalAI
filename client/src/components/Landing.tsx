import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Database, Brain, BarChart4, Map, Layers } from "lucide-react";
import { useUIStore } from "@/lib/stores/useUIStore";
import { useTerrainStore } from "@/lib/stores/useTerrainStore";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "sonner";

export default function Landing() {
  const { setAppMode } = useUIStore();
  const { setTerrainData, setLoading, setError } = useTerrainStore();
  const [isLoading, setIsLoading] = useState(false);

  // Placeholder background image
  const backgroundImage = "https://pixabay.com/get/g5346738a86459aa37e03734e0da637ea16fd2d6777c67915d9c63302c88eb137f13837ed217bd5fe2592ee12194bfc12d8f969a00db00663f3831803839c7139_1280.jpg";

  const startExploring = async () => {
    setIsLoading(true);
    
    try {
      setLoading(true);
      
      // Fetch initial terrain data
      const res = await apiRequest("GET", "/api/terrain", undefined);
      const data = await res.json();
      
      setTerrainData(data);
      setError(null);
      setAppMode('viewer');
      
    } catch (error) {
      console.error("Failed to load terrain data:", error);
      toast.error("Failed to load terrain data. Please try again.");
      setError("Failed to load terrain data. Please try again.");
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        ></div>
        <div className="absolute inset-0 hero-overlay z-0"></div>
        
        <div className="container mx-auto px-6 relative z-10 text-white">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Advanced Geological <span className="gradient-text">Visualization</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">
              Explore subsurface terrain with AI-powered insights and interactive 3D visualization
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={startExploring} 
                disabled={isLoading}
                className="bg-accent hover:bg-accent/90 text-white rounded-full px-8"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="loading-spinner w-5 h-5 border-2 border-current border-t-transparent rounded-full mr-2"></span>
                    Loading...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Start Exploring <ArrowRight className="ml-2" />
                  </span>
                )}
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 rounded-full px-8"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Geological Analysis</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              GeoSphere combines advanced 3D visualization with AI-powered insights to revolutionize geological exploration
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Layers className="text-accent" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Interactive Layering</h3>
              <p className="text-muted-foreground">
                Visualize and interact with detailed geological layers in real-time 3D environments
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Brain className="text-accent" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Insights</h3>
              <p className="text-muted-foreground">
                Get real-time anomaly detection and resource potential analysis with advanced AI algorithms
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="text-accent" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Precise Drill Mapping</h3>
              <p className="text-muted-foreground">
                Plan and visualize drill points with exact coordinates and depth information
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Map className="text-accent" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Terrain Analysis</h3>
              <p className="text-muted-foreground">
                Comprehensive terrain data with fault lines, composition analysis, and structural information
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Database className="text-accent" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Data Integration</h3>
              <p className="text-muted-foreground">
                Seamlessly import and integrate your existing geological data sets and surveys
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart4 className="text-accent" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Reporting</h3>
              <p className="text-muted-foreground">
                Generate comprehensive analytical reports with visualization exports and data summaries
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-accent text-accent-foreground">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Geological Exploration?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Start using GeoSphere today and unlock powerful insights from your geological data
          </p>
          <Button 
            size="lg" 
            onClick={startExploring}
            disabled={isLoading}
            className="bg-white text-accent hover:bg-white/90 rounded-full px-8"
          >
            {isLoading ? (
              <span className="flex items-center">
                <span className="loading-spinner w-5 h-5 border-2 border-current border-t-transparent rounded-full mr-2"></span>
                Loading...
              </span>
            ) : (
              <span className="flex items-center">
                Start Exploring <ArrowRight className="ml-2" />
              </span>
            )}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-card border-t border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="font-bold text-xl">GeoSphere</h3>
              <p className="text-muted-foreground">Advanced Geological Visualization</p>
            </div>
            
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-foreground">About</a>
              <a href="#" className="text-muted-foreground hover:text-foreground">Features</a>
              <a href="#" className="text-muted-foreground hover:text-foreground">Documentation</a>
              <a href="#" className="text-muted-foreground hover:text-foreground">Contact</a>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-border text-center text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} GeoSphere. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
