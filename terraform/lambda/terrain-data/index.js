exports.handler = async (event) => {
  try {
    // Mock terrain data - In production, this would fetch from a database
    const terrainData = {
      id: "terrain-1",
      name: "Mountain Range Cross-Section",
      dimensions: {
        width: 1000,
        height: 500,
        depth: 300
      },
      layers: [
        {
          id: "layer-1",
          name: "Topsoil",
          depth: 0,
          thickness: 20,
          color: "#8B4513",
          material: "soil",
          opacity: 1,
          metadata: {
            age: "Recent",
            composition: "Organic matter, clay",
            porosity: 0.5,
            permeability: 0.4,
            density: 1.2
          },
          visible: true
        },
        {
          id: "layer-2",
          name: "Clay",
          depth: 20,
          thickness: 30,
          color: "#D2691E",
          material: "clay",
          opacity: 1,
          metadata: {
            age: "Quaternary",
            composition: "Clay, silt",
            porosity: 0.2,
            permeability: 0.1,
            density: 1.5
          },
          visible: true
        },
        {
          id: "layer-3",
          name: "Sandstone",
          depth: 50,
          thickness: 80,
          color: "#F4A460",
          material: "sandstone",
          opacity: 1,
          metadata: {
            age: "Tertiary",
            composition: "Quartz, feldspar",
            porosity: 0.3,
            permeability: 0.6,
            density: 2.0
          },
          visible: true
        },
        {
          id: "layer-4",
          name: "Limestone",
          depth: 130,
          thickness: 70,
          color: "#F5F5DC",
          material: "limestone",
          opacity: 1,
          metadata: {
            age: "Cretaceous",
            composition: "Calcium carbonate",
            porosity: 0.15,
            permeability: 0.2,
            density: 2.5
          },
          visible: true
        },
        {
          id: "layer-5",
          name: "Granite",
          depth: 200,
          thickness: 100,
          color: "#A9A9A9",
          material: "granite",
          opacity: 1,
          metadata: {
            age: "Precambrian",
            composition: "Quartz, feldspar, mica",
            porosity: 0.05,
            permeability: 0.01,
            density: 2.7
          },
          visible: true
        }
      ],
      drillPoints: [
        {
          id: "drill-1",
          name: "North Ridge",
          position: {
            x: 200,
            y: 0,
            z: 150
          },
          metadata: {
            date: "2025-01-15",
            depth: 250,
            sampleData: "Core samples show high mineral content"
          }
        },
        {
          id: "drill-2",
          name: "Central Valley",
          position: {
            x: 500,
            y: 0,
            z: 150
          },
          metadata: {
            date: "2025-02-20",
            depth: 200,
            sampleData: "Potential aquifer detected at 180m depth"
          }
        },
        {
          id: "drill-3",
          name: "South Slope",
          position: {
            x: 800,
            y: 0,
            z: 150
          },
          metadata: {
            date: "2025-03-10",
            depth: 220,
            sampleData: "Traces of rare earth elements found"
          }
        }
      ]
    };
    
    // Return successful response
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      },
      body: JSON.stringify(terrainData)
    };
  } catch (error) {
    console.error("Error in terrain-data lambda:", error);
    
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