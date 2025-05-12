import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

// Mock terrain data
const mockTerrainData = {
  id: "terrain1",
  name: "Example Terrain Site",
  dimensions: {
    width: 20,
    height: 10,
    depth: 20,
  },
  layers: [
    {
      id: "layer1",
      name: "Topsoil",
      depth: 0,
      thickness: 1.5,
      color: "#8B4513",
      material: "soil",
      opacity: 0.9,
      metadata: {
        age: "Recent",
        composition: "Silty loam",
        porosity: 35,
        permeability: 150,
        density: 1.3,
      },
      visible: true,
    },
    {
      id: "layer2",
      name: "Sandy Clay",
      depth: 1.5,
      thickness: 3.0,
      color: "#D2B48C",
      material: "clay",
      opacity: 0.9,
      metadata: {
        age: "Holocene",
        composition: "Sandy clay",
        porosity: 28,
        permeability: 50,
        density: 1.8,
      },
      visible: true,
    },
    {
      id: "layer3",
      name: "Sandstone",
      depth: 4.5,
      thickness: 4.0,
      color: "#F4A460",
      material: "sand",
      opacity: 0.9,
      metadata: {
        age: "Pleistocene",
        composition: "Quartz sandstone",
        porosity: 22,
        permeability: 120,
        density: 2.2,
      },
      visible: true,
    },
    {
      id: "layer4",
      name: "Limestone",
      depth: 8.5,
      thickness: 5.0,
      color: "#D3D3D3",
      material: "rock",
      opacity: 0.9,
      metadata: {
        age: "Cretaceous",
        composition: "Calcite-rich limestone",
        porosity: 15,
        permeability: 35,
        density: 2.7,
      },
      visible: true,
    },
    {
      id: "layer5",
      name: "Shale",
      depth: 13.5,
      thickness: 6.5,
      color: "#696969",
      material: "rock",
      opacity: 0.9,
      metadata: {
        age: "Jurassic",
        composition: "Clay-rich shale",
        porosity: 8,
        permeability: 10,
        density: 2.4,
      },
      visible: true,
    },
    {
      id: "layer6",
      name: "Granite Bedrock",
      depth: 20.0,
      thickness: 10.0,
      color: "#A9A9A9",
      material: "rock",
      opacity: 0.9,
      metadata: {
        age: "Precambrian",
        composition: "Granite",
        porosity: 3,
        permeability: 1,
        density: 2.8,
      },
      visible: true,
    },
  ],
  drillPoints: [
    {
      id: "dp1",
      name: "Drill Point A",
      position: {
        x: -5,
        y: 0,
        z: -3,
      },
      metadata: {
        date: "2023-04-15",
        depth: 18.5,
        sampleData: "Core sample with traces of minerals",
      },
    },
    {
      id: "dp2",
      name: "Drill Point B",
      position: {
        x: 4,
        y: 0,
        z: 6,
      },
      metadata: {
        date: "2023-06-22",
        depth: 12.0,
        sampleData: "Sedimentary layers with fossil inclusions",
      },
    },
    {
      id: "dp3",
      name: "Drill Point C",
      position: {
        x: -2,
        y: 0,
        z: 5,
      },
      metadata: {
        date: "2023-08-10",
        depth: 25.0,
        sampleData: "Igneous intrusion detected",
      },
    },
  ],
};

// Mock AI insights
let mockInsights = [
  {
    id: "ins_abc123",
    timestamp: new Date().toISOString(),
    type: "anomaly",
    location: {
      x: -3.2,
      y: -5.7,
      z: 2.1,
    },
    layerId: "layer2",
    confidence: 0.87,
    description: "Unexpected density pattern detected that doesn't match surrounding geological formations.",
    recommendation: "Consider additional scanning in this region to verify the anomaly.",
    severity: "medium",
  },
  {
    id: "ins_def456",
    timestamp: new Date().toISOString(),
    type: "potential_resource",
    location: {
      x: 4.8,
      y: -12.3,
      z: -1.9,
    },
    layerId: "layer4",
    confidence: 0.92,
    description: "Mineral composition suggests potential natural resource deposits.",
    recommendation: "This area shows promising indicators for resource exploration.",
    severity: "high",
  },
  {
    id: "ins_ghi789",
    timestamp: new Date().toISOString(),
    type: "fault_line",
    location: {
      x: 1.5,
      y: -18.2,
      z: 3.7,
    },
    layerId: "layer5",
    confidence: 0.78,
    description: "Pattern suggests a previously undetected fault line running through this region.",
    recommendation: "Further structural analysis recommended to determine fault characteristics.",
    severity: "medium",
  }
];

// Helper function to generate random insights
function generateRandomInsights() {
  const insightTypes = ["anomaly", "potential_resource", "structural_weakness", "density_variation", "fault_line"];
  const severityLevels = ["low", "medium", "high"];
  const layerIds = ["layer1", "layer2", "layer3", "layer4", "layer5", "layer6"];
  
  const numInsights = Math.floor(Math.random() * 6) + 5; // 5-10 insights
  const newInsights = [];
  
  for (let i = 0; i < numInsights; i++) {
    const insightType = insightTypes[Math.floor(Math.random() * insightTypes.length)];
    const severity = severityLevels[Math.floor(Math.random() * severityLevels.length)];
    const layerId = layerIds[Math.floor(Math.random() * layerIds.length)];
    const confidence = 0.5 + (Math.random() * 0.4); // Between 0.5 and 0.9
    
    // Create position
    const x = (Math.random() * 20) - 10; // -10 to 10
    const y = -(Math.random() * 25);     // 0 to -25
    const z = (Math.random() * 20) - 10; // -10 to 10
    
    // Description and recommendation based on insight type
    let description = "";
    let recommendation = "";
    
    switch (insightType) {
      case "anomaly":
        description = "Unexpected density pattern detected that doesn't match surrounding geological formations.";
        recommendation = "Consider additional scanning in this region to verify the anomaly.";
        break;
      case "potential_resource":
        description = "Mineral composition suggests potential natural resource deposits.";
        recommendation = "This area shows promising indicators for resource exploration.";
        break;
      case "structural_weakness":
        description = "Analysis indicates possible fracture or weakness in rock formation.";
        recommendation = "Conduct stability analysis before any excavation or construction.";
        break;
      case "density_variation":
        description = "Significant variation in density detected between adjacent formations.";
        recommendation = "Map the boundary regions more precisely to understand the transition zone.";
        break;
      case "fault_line":
        description = "Pattern suggests a previously undetected fault line running through this region.";
        recommendation = "Further structural analysis recommended to determine fault characteristics.";
        break;
      default:
        description = "Geological formation of interest detected in this region.";
        recommendation = "Further investigation recommended.";
    }
    
    // Create insight
    newInsights.push({
      id: `ins_${Math.random().toString(36).substring(2, 10)}`,
      timestamp: new Date().toISOString(),
      type: insightType,
      location: {
        x,
        y,
        z,
      },
      layerId,
      confidence,
      description,
      recommendation,
      severity,
    });
  }
  
  return newInsights;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Terrain data endpoint
  app.get("/api/terrain", (req, res) => {
    try {
      // Return mock terrain data
      res.json(mockTerrainData);
    } catch (error) {
      console.error("Error in terrain endpoint:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // AI Insights endpoint
  app.get("/api/insights", (req, res) => {
    try {
      // Return mock insights
      res.json(mockInsights);
    } catch (error) {
      console.error("Error in insights endpoint:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Run new analysis endpoint
  app.post("/api/insights/analyze", (req, res) => {
    try {
      // Generate new mock insights
      mockInsights = generateRandomInsights();
      
      // Return success response
      res.json({
        status: "success",
        message: "Analysis completed successfully",
      });
    } catch (error) {
      console.error("Error in analyze endpoint:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
