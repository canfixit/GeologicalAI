// Add this file to create a proxy for the Go server when it's not available
import { Request, Response } from "express";
import fetch from "node-fetch";

// Mock data if the Go server is not available
const mockTerrainData = {
  id: "terrain-1",
  name: "Mountain Range Cross-Section",
  dimensions: {
    width: 1000,
    height: 500,
    depth: 600,
  },
  layers: [
    {
      id: "layer-1",
      name: "Topsoil",
      depth: 0,
      thickness: 20,
      color: "#8B4513",
      material: "soil",
      opacity: 0.9,
      metadata: {
        age: "Recent",
        composition: "Organic matter, clay, silt",
        porosity: 0.5,
        permeability: 0.4,
        density: 1.2,
      },
      visible: true,
    },
    {
      id: "layer-2",
      name: "Clay",
      depth: 20,
      thickness: 50,
      color: "#A0522D",
      material: "clay",
      opacity: 0.85,
      metadata: {
        age: "Holocene",
        composition: "Clay minerals, quartz",
        porosity: 0.4,
        permeability: 0.1,
        density: 1.5,
      },
      visible: true,
    },
    {
      id: "layer-3",
      name: "Sandstone",
      depth: 70,
      thickness: 150,
      color: "#DEB887",
      material: "sandstone",
      opacity: 0.8,
      metadata: {
        age: "Cretaceous",
        composition: "Quartz, feldspar",
        porosity: 0.3,
        permeability: 0.6,
        density: 2.3,
      },
      visible: true,
    },
    {
      id: "layer-4",
      name: "Limestone",
      depth: 220,
      thickness: 180,
      color: "#F5F5DC",
      material: "limestone",
      opacity: 0.75,
      metadata: {
        age: "Jurassic",
        composition: "Calcium carbonate",
        porosity: 0.2,
        permeability: 0.3,
        density: 2.7,
      },
      visible: true,
    },
    {
      id: "layer-5",
      name: "Shale",
      depth: 400,
      thickness: 100,
      color: "#2F4F4F",
      material: "shale",
      opacity: 0.7,
      metadata: {
        age: "Triassic",
        composition: "Clay minerals, quartz, organic matter",
        porosity: 0.1,
        permeability: 0.05,
        density: 2.4,
      },
      visible: true,
    },
    {
      id: "layer-6",
      name: "Granite",
      depth: 500,
      thickness: 100,
      color: "#B0B0B0",
      material: "granite",
      opacity: 0.9,
      metadata: {
        age: "Precambrian",
        composition: "Quartz, feldspar, mica",
        porosity: 0.01,
        permeability: 0.001,
        density: 2.8,
      },
      visible: true,
    },
  ],
  drillPoints: [
    {
      id: "drill-1",
      name: "Drill Site Alpha",
      position: {
        x: 200,
        y: 0,
        z: 100,
      },
      metadata: {
        date: "2024-02-15",
        depth: 450,
        sampleData: "Sandstone with oil traces at 320m depth",
      },
    },
    {
      id: "drill-2",
      name: "Drill Site Beta",
      position: {
        x: 600,
        y: 0,
        z: 300,
      },
      metadata: {
        date: "2024-03-22",
        depth: 520,
        sampleData: "Limestone with karst features at 250m depth",
      },
    },
    {
      id: "drill-3",
      name: "Drill Site Gamma",
      position: {
        x: 800,
        y: 0,
        z: 450,
      },
      metadata: {
        date: "2024-04-10",
        depth: 580,
        sampleData: "Granite with mineral veins at 550m depth",
      },
    },
  ],
};

// Mock AI insights data
let mockInsights = [
  {
    id: "insight-1",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    type: "potential_resource",
    location: {
      x: 300,
      y: 120,
      z: 250,
    },
    layerId: "layer-3",
    confidence: 0.85,
    description: "High porosity zone detected in sandstone layer with potential hydrocarbon signatures",
    recommendation: "Recommend detailed seismic survey to confirm potential oil reservoir",
    severity: "medium",
  },
  {
    id: "insight-2",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    type: "structural_weakness",
    location: {
      x: 520,
      y: 280,
      z: 180,
    },
    layerId: "layer-4",
    confidence: 0.92,
    description: "Fracture pattern detected in limestone layer with potential for cave formation",
    recommendation: "Monitor for subsidence risk and consider reinforcement in construction plans",
    severity: "high",
  },
  {
    id: "insight-3",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    type: "fault_line",
    location: {
      x: 700,
      y: 350,
      z: 450,
    },
    layerId: "layer-5",
    confidence: 0.78,
    description: "Discontinuity detected across multiple layers indicating potential fault line",
    recommendation: "Consider fault implications for building foundations and water drainage",
    severity: "medium",
  },
  {
    id: "insight-4",
    timestamp: new Date().toISOString(),
    type: "density_variation",
    location: {
      x: 420,
      y: 150,
      z: 320,
    },
    layerId: "layer-3",
    confidence: 0.65,
    description: "Unusual density variation detected in sandstone layer, potential mineral deposit",
    recommendation: "Sample for rare earth elements and assess economic viability",
    severity: "low",
  },
  {
    id: "insight-5",
    timestamp: new Date().toISOString(),
    type: "anomaly",
    location: {
      x: 850,
      y: 400,
      z: 520,
    },
    layerId: "layer-6",
    confidence: 0.88,
    description: "Unexpected material composition detected in granite layer, potential intrusion",
    recommendation: "Further analysis recommended to identify geological history",
    severity: "low",
  },
];

function generateRandomInsights() {
  const insightTypes = ["anomaly", "potential_resource", "structural_weakness", "density_variation", "fault_line"];
  const severities = ["low", "medium", "high"];
  const layers = ["layer-1", "layer-2", "layer-3", "layer-4", "layer-5", "layer-6"];
  
  // Generate 3-7 random insights
  const numInsights = Math.floor(Math.random() * 5) + 3;
  const newInsights = [];
  
  for (let i = 0; i < numInsights; i++) {
    const insightType = insightTypes[Math.floor(Math.random() * insightTypes.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const layerId = layers[Math.floor(Math.random() * layers.length)];
    
    // Generate random position within terrain bounds
    const pos = {
      x: Math.random() * 1000,
      y: Math.random() * 500,
      z: Math.random() * 600,
    };
    
    // Generate description and recommendation based on type
    let description = "", recommendation = "";
    switch (insightType) {
      case "anomaly":
        description = "Unexpected material composition detected, potential anomaly";
        recommendation = "Further analysis recommended to identify origin";
        break;
      case "potential_resource":
        description = "High porosity zone detected with potential resource signatures";
        recommendation = "Recommend detailed survey to confirm resource potential";
        break;
      case "structural_weakness":
        description = "Fracture pattern detected with potential for structural issues";
        recommendation = "Monitor for instability and consider reinforcement";
        break;
      case "density_variation":
        description = "Unusual density variation detected, potential mineral deposit";
        recommendation = "Sample for mineral content and assess economic viability";
        break;
      case "fault_line":
        description = "Discontinuity detected across layers indicating potential fault line";
        recommendation = "Consider fault implications for construction and stability";
        break;
      default:
        description = "Unknown feature detected in geological formation";
        recommendation = "Further investigation recommended";
        break;
    }
    
    // Create insight
    newInsights.push({
      id: `insight-${i+1}`,
      timestamp: new Date().toISOString(),
      type: insightType,
      location: pos,
      layerId: layerId,
      confidence: 0.5 + Math.random() * 0.5, // 0.5-1.0
      description: description,
      recommendation: recommendation,
      severity: severity,
    });
  }
  
  return newInsights;
}

// Function to check if Go server is running
async function isGoServerRunning() {
  try {
    const response = await fetch("http://localhost:8080/api/test", { timeout: 500 });
    return response.ok;
  } catch (error) {
    console.log("Go server check failed:", error.message);
    return false;
  }
}

// Handler for terrain data endpoint
export async function getTerrainData(req: Request, res: Response) {
  try {
    const goServerRunning = await isGoServerRunning();
    
    if (goServerRunning) {
      // Forward request to Go backend
      const response = await fetch("http://localhost:8080/api/terrain");
      if (!response.ok) {
        throw new Error('Failed to fetch terrain data from backend');
      }
      const data = await response.json();
      res.json(data);
    } else {
      // Use mock data if Go backend is not available
      console.log("Go server not available, using mock terrain data");
      res.json(mockTerrainData);
    }
  } catch (error) {
    console.error("Error in terrain endpoint:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Handler for AI insights endpoint
export async function getInsights(req: Request, res: Response) {
  try {
    const goServerRunning = await isGoServerRunning();
    
    if (goServerRunning) {
      // Forward request to Go backend
      const response = await fetch("http://localhost:8080/api/insights");
      if (!response.ok) {
        throw new Error('Failed to fetch insights from backend');
      }
      const data = await response.json();
      res.json(data);
    } else {
      // Use mock data if Go backend is not available
      console.log("Go server not available, using mock insights data");
      res.json(mockInsights);
    }
  } catch (error) {
    console.error("Error in insights endpoint:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Handler for running new analysis
export async function runAnalysis(req: Request, res: Response) {
  try {
    const goServerRunning = await isGoServerRunning();
    
    if (goServerRunning) {
      // Forward request to Go backend
      const response = await fetch("http://localhost:8080/api/insights/analyze", {
        method: "POST"
      });
      if (!response.ok) {
        throw new Error('Failed to run new analysis');
      }
      const data = await response.json();
      res.json(data);
    } else {
      // Generate new mock insights if Go backend is not available
      console.log("Go server not available, generating mock insights");
      mockInsights = generateRandomInsights();
      res.json({
        status: "success",
        message: "Analysis completed successfully (mock data)",
      });
    }
  } catch (error) {
    console.error("Error in analyze endpoint:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}