package handlers

import (
	"encoding/json"
	"geosphere/models"
	"math/rand"
	"net/http"
	"time"
)

// Initialize random seed
func init() {
	rand.Seed(time.Now().UnixNano())
}

// GetTerrainData handles requests for terrain data
func GetTerrainData(w http.ResponseWriter, r *http.Request) {
	// Create simulated terrain data
	terrainData := generateMockTerrainData()

	// Set content type header
	w.Header().Set("Content-Type", "application/json")

	// Encode and return the data
	json.NewEncoder(w).Encode(terrainData)
}

// generateMockTerrainData creates sample geological terrain data
func generateMockTerrainData() models.TerrainData {
	// Define dimensions of the terrain
	dimensions := models.Dimensions{
		Width:  20,
		Height: 10,
		Depth:  20,
	}

	// Create mock layers
	layers := []models.TerrainLayer{
		{
			ID:        "layer1",
			Name:      "Topsoil",
			Depth:     0,
			Thickness: 1.5,
			Color:     "#8B4513",
			Material:  "soil",
			Opacity:   0.9,
			Metadata: models.LayerMetadata{
				Age:          "Recent",
				Composition:  "Silty loam",
				Porosity:     35,
				Permeability: 150,
				Density:      1.3,
			},
			Visible: true,
		},
		{
			ID:        "layer2",
			Name:      "Sandy Clay",
			Depth:     1.5,
			Thickness: 3.0,
			Color:     "#D2B48C",
			Material:  "clay",
			Opacity:   0.9,
			Metadata: models.LayerMetadata{
				Age:          "Holocene",
				Composition:  "Sandy clay",
				Porosity:     28,
				Permeability: 50,
				Density:      1.8,
			},
			Visible: true,
		},
		{
			ID:        "layer3",
			Name:      "Sandstone",
			Depth:     4.5,
			Thickness: 4.0,
			Color:     "#F4A460",
			Material:  "sand",
			Opacity:   0.9,
			Metadata: models.LayerMetadata{
				Age:          "Pleistocene",
				Composition:  "Quartz sandstone",
				Porosity:     22,
				Permeability: 120,
				Density:      2.2,
			},
			Visible: true,
		},
		{
			ID:        "layer4",
			Name:      "Limestone",
			Depth:     8.5,
			Thickness: 5.0,
			Color:     "#D3D3D3",
			Material:  "rock",
			Opacity:   0.9,
			Metadata: models.LayerMetadata{
				Age:          "Cretaceous",
				Composition:  "Calcite-rich limestone",
				Porosity:     15,
				Permeability: 35,
				Density:      2.7,
			},
			Visible: true,
		},
		{
			ID:        "layer5",
			Name:      "Shale",
			Depth:     13.5,
			Thickness: 6.5,
			Color:     "#696969",
			Material:  "rock",
			Opacity:   0.9,
			Metadata: models.LayerMetadata{
				Age:          "Jurassic",
				Composition:  "Clay-rich shale",
				Porosity:     8,
				Permeability: 10,
				Density:      2.4,
			},
			Visible: true,
		},
		{
			ID:        "layer6",
			Name:      "Granite Bedrock",
			Depth:     20.0,
			Thickness: 10.0,
			Color:     "#A9A9A9",
			Material:  "rock",
			Opacity:   0.9,
			Metadata: models.LayerMetadata{
				Age:          "Precambrian",
				Composition:  "Granite",
				Porosity:     3,
				Permeability: 1,
				Density:      2.8,
			},
			Visible: true,
		},
	}

	// Generate drill points
	drillPoints := []models.DrillPoint{
		{
			ID:   "dp1",
			Name: "Drill Point A",
			Position: models.Position{
				X: -5,
				Y: 0,
				Z: -3,
			},
			Metadata: models.DrillPointMetadata{
				Date:       "2023-04-15",
				Depth:      18.5,
				SampleData: "Core sample with traces of minerals",
			},
		},
		{
			ID:   "dp2",
			Name: "Drill Point B",
			Position: models.Position{
				X: 4,
				Y: 0,
				Z: 6,
			},
			Metadata: models.DrillPointMetadata{
				Date:       "2023-06-22",
				Depth:      12.0,
				SampleData: "Sedimentary layers with fossil inclusions",
			},
		},
		{
			ID:   "dp3",
			Name: "Drill Point C",
			Position: models.Position{
				X: -2,
				Y: 0,
				Z: 5,
			},
			Metadata: models.DrillPointMetadata{
				Date:       "2023-08-10",
				Depth:      25.0,
				SampleData: "Igneous intrusion detected",
			},
		},
	}

	// Return complete terrain data
	return models.TerrainData{
		ID:   "terrain1",
		Name: "Example Terrain Site",
		Dimensions: models.Dimensions{
			Width:  dimensions.Width,
			Height: dimensions.Height,
			Depth:  dimensions.Depth,
		},
		Layers:      layers,
		DrillPoints: drillPoints,
	}
}
