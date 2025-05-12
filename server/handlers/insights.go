package handlers

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"time"
)

// InsightType represents the different types of AI insights
type InsightType string

const (
	Anomaly           InsightType = "anomaly"
	PotentialResource InsightType = "potential_resource"
	StructuralWeakness InsightType = "structural_weakness"
	DensityVariation   InsightType = "density_variation"
	FaultLine          InsightType = "fault_line"
)

// Severity represents the severity level of an insight
type Severity string

const (
	Low    Severity = "low"
	Medium Severity = "medium"
	High   Severity = "high"
)

// AIInsight represents an AI-generated insight about the terrain
type AIInsight struct {
	ID            string     `json:"id"`
	Timestamp     string     `json:"timestamp"`
	Type          InsightType `json:"type"`
	Location      Position   `json:"location"`
	LayerID       string     `json:"layerId,omitempty"`
	Confidence    float64    `json:"confidence"`
	Description   string     `json:"description"`
	Recommendation string     `json:"recommendation,omitempty"`
	Severity      Severity   `json:"severity"`
}

// Mock insights data
var mockInsights = []AIInsight{
	{
		ID:          "insight-1",
		Timestamp:   time.Now().AddDate(0, 0, -5).Format(time.RFC3339),
		Type:        PotentialResource,
		Location: Position{
			X: 300,
			Y: 120,
			Z: 250,
		},
		LayerID:     "layer-3",
		Confidence:  0.85,
		Description: "High porosity zone detected in sandstone layer with potential hydrocarbon signatures",
		Recommendation: "Recommend detailed seismic survey to confirm potential oil reservoir",
		Severity:    Medium,
	},
	{
		ID:          "insight-2",
		Timestamp:   time.Now().AddDate(0, 0, -3).Format(time.RFC3339),
		Type:        StructuralWeakness,
		Location: Position{
			X: 520,
			Y: 280,
			Z: 180,
		},
		LayerID:     "layer-4",
		Confidence:  0.92,
		Description: "Fracture pattern detected in limestone layer with potential for cave formation",
		Recommendation: "Monitor for subsidence risk and consider reinforcement in construction plans",
		Severity:    High,
	},
	{
		ID:          "insight-3",
		Timestamp:   time.Now().AddDate(0, 0, -1).Format(time.RFC3339),
		Type:        FaultLine,
		Location: Position{
			X: 700,
			Y: 350,
			Z: 450,
		},
		LayerID:     "layer-5",
		Confidence:  0.78,
		Description: "Discontinuity detected across multiple layers indicating potential fault line",
		Recommendation: "Consider fault implications for building foundations and water drainage",
		Severity:    Medium,
	},
	{
		ID:          "insight-4",
		Timestamp:   time.Now().Format(time.RFC3339),
		Type:        DensityVariation,
		Location: Position{
			X: 420,
			Y: 150,
			Z: 320,
		},
		LayerID:     "layer-3",
		Confidence:  0.65,
		Description: "Unusual density variation detected in sandstone layer, potential mineral deposit",
		Recommendation: "Sample for rare earth elements and assess economic viability",
		Severity:    Low,
	},
	{
		ID:          "insight-5",
		Timestamp:   time.Now().Format(time.RFC3339),
		Type:        Anomaly,
		Location: Position{
			X: 850,
			Y: 400,
			Z: 520,
		},
		LayerID:     "layer-6",
		Confidence:  0.88,
		Description: "Unexpected material composition detected in granite layer, potential intrusion",
		Recommendation: "Further analysis recommended to identify geological history",
		Severity:    Low,
	},
}

// GetInsights returns AI insights data
func GetInsights(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	// Simulate loading time
	time.Sleep(300 * time.Millisecond)
	json.NewEncoder(w).Encode(mockInsights)
}

// RunAnalysis generates new insights
func RunAnalysis(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	
	// Simulate analysis running time
	time.Sleep(1 * time.Second)
	
	// Generate new random insights
	mockInsights = generateRandomInsights()
	
	// Return success response
	json.NewEncoder(w).Encode(map[string]string{
		"status":  "success",
		"message": "Analysis completed successfully",
	})
}

// generateRandomInsights creates a new set of random insights
func generateRandomInsights() []AIInsight {
	// Random seed
	rand.Seed(time.Now().UnixNano())
	
	// Insight types and severities
	insightTypes := []InsightType{Anomaly, PotentialResource, StructuralWeakness, DensityVariation, FaultLine}
	severities := []Severity{Low, Medium, High}
	layers := []string{"layer-1", "layer-2", "layer-3", "layer-4", "layer-5", "layer-6"}
	
	// Generate 3-7 random insights
	numInsights := rand.Intn(5) + 3
	insights := make([]AIInsight, numInsights)
	
	for i := 0; i < numInsights; i++ {
		insightType := insightTypes[rand.Intn(len(insightTypes))]
		severity := severities[rand.Intn(len(severities))]
		layerID := layers[rand.Intn(len(layers))]
		
		// Generate random position within terrain bounds
		pos := Position{
			X: rand.Float64() * 1000,
			Y: rand.Float64() * 500,
			Z: rand.Float64() * 600,
		}
		
		// Generate description and recommendation based on type
		var description, recommendation string
		switch insightType {
		case Anomaly:
			description = "Unexpected material composition detected, potential anomaly"
			recommendation = "Further analysis recommended to identify origin"
		case PotentialResource:
			description = "High porosity zone detected with potential resource signatures"
			recommendation = "Recommend detailed survey to confirm resource potential"
		case StructuralWeakness:
			description = "Fracture pattern detected with potential for structural issues"
			recommendation = "Monitor for instability and consider reinforcement"
		case DensityVariation:
			description = "Unusual density variation detected, potential mineral deposit"
			recommendation = "Sample for mineral content and assess economic viability"
		case FaultLine:
			description = "Discontinuity detected across layers indicating potential fault line"
			recommendation = "Consider fault implications for construction and stability"
		}
		
		// Create insight
		insights[i] = AIInsight{
			ID:            fmt.Sprintf("insight-%d", i+1),
			Timestamp:     time.Now().Format(time.RFC3339),
			Type:          insightType,
			Location:      pos,
			LayerID:       layerID,
			Confidence:    0.5 + rand.Float64()*0.5, // 0.5-1.0
			Description:   description,
			Recommendation: recommendation,
			Severity:      severity,
		}
	}
	
	return insights
}