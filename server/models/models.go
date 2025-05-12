package models

// TerrainData represents the complete terrain model
type TerrainData struct {
	ID         string       `json:"id"`
	Name       string       `json:"name"`
	Dimensions Dimensions   `json:"dimensions"`
	Layers     []TerrainLayer `json:"layers"`
	DrillPoints []DrillPoint  `json:"drillPoints"`
}

// Dimensions represents the size of the terrain
type Dimensions struct {
	Width  float64 `json:"width"`
	Height float64 `json:"height"`
	Depth  float64 `json:"depth"`
}

// TerrainLayer represents a geological layer in the terrain
type TerrainLayer struct {
	ID        string       `json:"id"`
	Name      string       `json:"name"`
	Depth     float64      `json:"depth"`
	Thickness float64      `json:"thickness"`
	Color     string       `json:"color"`
	Material  string       `json:"material"`
	Opacity   float64      `json:"opacity"`
	Metadata  LayerMetadata `json:"metadata"`
	Visible   bool         `json:"visible"`
}

// LayerMetadata contains additional information about a terrain layer
type LayerMetadata struct {
	Age          string  `json:"age"`
	Composition  string  `json:"composition"`
	Porosity     float64 `json:"porosity"`
	Permeability float64 `json:"permeability"`
	Density      float64 `json:"density"`
}

// DrillPoint represents a drilling location
type DrillPoint struct {
	ID       string             `json:"id"`
	Name     string             `json:"name"`
	Position Position           `json:"position"`
	Metadata DrillPointMetadata `json:"metadata"`
}

// DrillPointMetadata contains additional information about a drill point
type DrillPointMetadata struct {
	Date       string `json:"date"`
	Depth      float64 `json:"depth"`
	SampleData string `json:"sampleData"`
}

// Position represents a 3D coordinate
type Position struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
	Z float64 `json:"z"`
}

// AIInsight represents an AI-generated insight
type AIInsight struct {
	ID            string     `json:"id"`
	Timestamp     string     `json:"timestamp"`
	Type          InsightType `json:"type"`
	Location      Position   `json:"location"`
	LayerID       string     `json:"layerId,omitempty"`
	Confidence    float64    `json:"confidence"`
	Description   string     `json:"description"`
	Recommendation string     `json:"recommendation,omitempty"`
	Severity      string     `json:"severity"`
}

// InsightType represents the type of insight
type InsightType string

// Constants for insight types
const (
	InsightTypeAnomaly           InsightType = "anomaly"
	InsightTypePotentialResource InsightType = "potential_resource"
	InsightTypeStructuralWeakness InsightType = "structural_weakness"
	InsightTypeDensityVariation   InsightType = "density_variation"
	InsightTypeFaultLine          InsightType = "fault_line"
)
