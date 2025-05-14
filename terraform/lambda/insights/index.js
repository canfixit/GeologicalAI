exports.handler = async (event) => {
  try {
    // Mock insights data - In production, this would fetch from a database
    const insightsData = [
      {
        id: "insight-1",
        timestamp: "2025-05-07T12:45:00Z",
        type: "potential_resource",
        location: {
          x: 450,
          y: 0,
          z: 150
        },
        layerId: "layer-3",
        confidence: 0.85,
        description: "High porosity region detected in sandstone layer, potential hydrocarbon trap.",
        recommendation: "Consider exploratory drilling to confirm reservoir presence.",
        severity: "medium"
      },
      {
        id: "insight-2",
        timestamp: "2025-05-07T12:46:30Z",
        type: "structural_weakness",
        location: {
          x: 680,
          y: 0,
          z: 220
        },
        layerId: "layer-4",
        confidence: 0.72,
        description: "Potential fault line detected in limestone layer, may impact structural integrity.",
        recommendation: "Conduct additional seismic analysis in this region.",
        severity: "high"
      },
      {
        id: "insight-3",
        timestamp: "2025-05-07T12:47:15Z",
        type: "density_variation",
        location: {
          x: 320,
          y: 0,
          z: 90
        },
        layerId: "layer-2",
        confidence: 0.68,
        description: "Anomalous density readings in clay layer, possible mineral deposit.",
        recommendation: "Further geochemical testing recommended.",
        severity: "low"
      },
      {
        id: "insight-4",
        timestamp: "2025-05-07T12:48:45Z",
        type: "anomaly",
        location: {
          x: 150,
          y: 0,
          z: 250
        },
        layerId: "layer-5",
        confidence: 0.91,
        description: "Unusual crystalline structure detected in granite layer, potential rare mineral formation.",
        recommendation: "Extract core sample for detailed laboratory analysis.",
        severity: "medium"
      },
      {
        id: "insight-5",
        timestamp: "2025-05-07T12:50:10Z",
        type: "fault_line",
        location: {
          x: 780,
          y: 0,
          z: 180
        },
        confidence: 0.88,
        description: "Major fault line detected running through multiple layers, may indicate historical tectonic activity.",
        recommendation: "Map fault extent and assess stability implications.",
        severity: "high"
      }
    ];
    
    // Return successful response
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      },
      body: JSON.stringify(insightsData)
    };
  } catch (error) {
    console.error("Error in insights lambda:", error);
    
    // Return error response
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ message: "Internal Server Error" })
    };
  }
};