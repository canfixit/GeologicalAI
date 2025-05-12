package handlers

import (
	"encoding/json"
	"net/http"
	"time"
)

// TerrainData represents a geological terrain model
type TerrainData struct {
	ID         string      `json:"id"`
	Name       string      `json:"name"`
	Dimensions Dimensions  `json:"dimensions"`
	Layers     []Layer     `json:"layers"`
	DrillPoints []DrillPoint `json:"drillPoints"`
}

// Dimensions represents the size of the terrain
type Dimensions struct {
	Width  float64 `json:"width"`
	Height float64 `json:"height"`
	Depth  float64 `json:"depth"`
}

// Layer represents a geological layer
type Layer struct {
	ID        string      `json:"id"`
	Name      string      `json:"name"`
	Depth     float64     `json:"depth"`
	Thickness float64     `json:"thickness"`
	Color     string      `json:"color"`
	Material  string      `json:"material"`
	Opacity   float64     `json:"opacity"`
	Metadata  LayerMetadata `json:"metadata"`
	Visible   bool        `json:"visible"`
}

// LayerMetadata contains detailed information about a layer
type LayerMetadata struct {
	Age          string  `json:"age"`
	Composition  string  `json:"composition"`
	Porosity     float64 `json:"porosity"`
	Permeability float64 `json:"permeability"`
	Density      float64 `json:"density"`
}

// DrillPoint represents a point where drilling data was collected
type DrillPoint struct {
	ID       string            `json:"id"`
	Name     string            `json:"name"`
	Position Position          `json:"position"`
	Metadata DrillPointMetadata `json:"metadata"`
}

// Position represents 3D coordinates
type Position struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
	Z float64 `json:"z"`
}

// DrillPointMetadata contains detailed information about a drill point
type DrillPointMetadata struct {
	Date       string  `json:"date"`
	Depth      float64 `json:"depth"`
	SampleData string  `json:"sampleData"`
}

// Mock terrain data
var mockTerrainData = TerrainData{
	ID:   "terrain-1",
	Name: "Mountain Range Cross-Section",
	Dimensions: Dimensions{
		Width:  1000,
		Height: 500,
		Depth:  600,
	},
	Layers: []Layer{
		{
			ID:        "layer-1",
			Name:      "Topsoil",
			Depth:     0,
			Thickness: 20,
			Color:     "#8B4513",
			Material:  "soil",
			Opacity:   0.9,
			Metadata: LayerMetadata{
				Age:          "Recent",
				Composition:  "Organic matter, clay, silt",
				Porosity:     0.5,
				Permeability: 0.4,
				Density:      1.2,
			},
			Visible: true,
		},
		{
			ID:        "layer-2",
			Name:      "Clay",
			Depth:     20,
			Thickness: 50,
			Color:     "#A0522D",
			Material:  "clay",
			Opacity:   0.85,
			Metadata: LayerMetadata{
				Age:          "Holocene",
				Composition:  "Clay minerals, quartz",
				Porosity:     0.4,
				Permeability: 0.1,
				Density:      1.5,
			},
			Visible: true,
		},
		{
			ID:        "layer-3",
			Name:      "Sandstone",
			Depth:     70,
			Thickness: 150,
			Color:     "#DEB887",
			Material:  "sandstone",
			Opacity:   0.8,
			Metadata: LayerMetadata{
				Age:          "Cretaceous",
				Composition:  "Quartz, feldspar",
				Porosity:     0.3,
				Permeability: 0.6,
				Density:      2.3,
			},
			Visible: true,
		},
		{
			ID:        "layer-4",
			Name:      "Limestone",
			Depth:     220,
			Thickness: 180,
			Color:     "#F5F5DC",
			Material:  "limestone",
			Opacity:   0.75,
			Metadata: LayerMetadata{
				Age:          "Jurassic",
				Composition:  "Calcium carbonate",
				Porosity:     0.2,
				Permeability: 0.3,
				Density:      2.7,
			},
			Visible: true,
		},
		{
			ID:        "layer-5",
			Name:      "Shale",
			Depth:     400,
			Thickness: 100,
			Color:     "#2F4F4F",
			Material:  "shale",
			Opacity:   0.7,
			Metadata: LayerMetadata{
				Age:          "Triassic",
				Composition:  "Clay minerals, quartz, organic matter",
				Porosity:     0.1,
				Permeability: 0.05,
				Density:      2.4,
			},
			Visible: true,
		},
		{
			ID:        "layer-6",
			Name:      "Granite",
			Depth:     500,
			Thickness: 100,
			Color:     "#B0B0B0",
			Material:  "granite",
			Opacity:   0.9,
			Metadata: LayerMetadata{
				Age:          "Precambrian",
				Composition:  "Quartz, feldspar, mica",
				Porosity:     0.01,
				Permeability: 0.001,
				Density:      2.8,
			},
			Visible: true,
		},
	},
	DrillPoints: []DrillPoint{
		{
			ID:   "drill-1",
			Name: "Drill Site Alpha",
			Position: Position{
				X: 200,
				Y: 0,
				Z: 100,
			},
			Metadata: DrillPointMetadata{
				Date:       "2024-02-15",
				Depth:      450,
				SampleData: "Sandstone with oil traces at 320m depth",
			},
		},
		{
			ID:   "drill-2",
			Name: "Drill Site Beta",
			Position: Position{
				X: 600,
				Y: 0,
				Z: 300,
			},
			Metadata: DrillPointMetadata{
				Date:       "2024-03-22",
				Depth:      520,
				SampleData: "Limestone with karst features at 250m depth",
			},
		},
		{
			ID:   "drill-3",
			Name: "Drill Site Gamma",
			Position: Position{
				X: 800,
				Y: 0,
				Z: 450,
			},
			Metadata: DrillPointMetadata{
				Date:       "2024-04-10",
				Depth:      580,
				SampleData: "Granite with mineral veins at 550m depth",
			},
		},
	},
}

// GetTerrainData returns terrain data
func GetTerrainData(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	// Simulate loading time
	time.Sleep(500 * time.Millisecond)
	json.NewEncoder(w).Encode(mockTerrainData)
}