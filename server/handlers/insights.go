package handlers

import (
	"encoding/json"
	"geosphere/models"
	"math/rand"
	"net/http"
	"time"
)

// Global variable to store insights
var cachedInsights []models.AIInsight

// GetInsights handles requests for AI-generated insights
func GetInsights(w http.ResponseWriter, r *http.Request) {
	// Initialize insights if empty
	if len(cachedInsights) == 0 {
		cachedInsights = generateInsights()
	}

	// Set content type header
	w.Header().Set("Content-Type", "application/json")

	// Encode and return the data
	json.NewEncoder(w).Encode(cachedInsights)
}

// RunAnalysis handles requests to run a new AI analysis
func RunAnalysis(w http.ResponseWriter, r *http.Request) {
	// Generate new insights
	cachedInsights = generateInsights()

	// Set content type header
	w.Header().Set("Content-Type", "application/json")

	// Return success response
	json.NewEncoder(w).Encode(map[string]string{
		"status":  "success",
		"message": "Analysis completed successfully",
	})
}

// generateInsights creates simulated AI insights
func generateInsights() []models.AIInsight {
	insightTypes := []models.InsightType{
		models.InsightTypeAnomaly,
		models.InsightTypePotentialResource,
		models.InsightTypeStructuralWeakness,
		models.InsightTypeDensityVariation,
		models.InsightTypeFaultLine,
	}

	severityLevels := []string{"low", "medium", "high"}
	layerIDs := []string{"layer1", "layer2", "layer3", "layer4", "layer5", "layer6"}

	// Generate between 5-10 random insights
	numInsights := rand.Intn(6) + 5
	insights := make([]models.AIInsight, numInsights)

	for i := 0; i < numInsights; i++ {
		insightType := insightTypes[rand.Intn(len(insightTypes))]
		severity := severityLevels[rand.Intn(len(severityLevels))]
		layerID := layerIDs[rand.Intn(len(layerIDs))]
		confidence := 0.5 + (rand.Float64() * 0.4) // Between 0.5 and 0.9

		// Create position
		x := (rand.Float64() * 20) - 10 // -10 to 10
		y := -(rand.Float64() * 25)     // 0 to -25
		z := (rand.Float64() * 20) - 10 // -10 to 10

		// Description and recommendation based on insight type
		var description, recommendation string

		switch insightType {
		case models.InsightTypeAnomaly:
			description = "Unexpected density pattern detected that doesn't match surrounding geological formations."
			recommendation = "Consider additional scanning in this region to verify the anomaly."

		case models.InsightTypePotentialResource:
			description = "Mineral composition suggests potential natural resource deposits."
			recommendation = "This area shows promising indicators for resource exploration."

		case models.InsightTypeStructuralWeakness:
			description = "Analysis indicates possible fracture or weakness in rock formation."
			recommendation = "Conduct stability analysis before any excavation or construction."

		case models.InsightTypeDensityVariation:
			description = "Significant variation in density detected between adjacent formations."
			recommendation = "Map the boundary regions more precisely to understand the transition zone."

		case models.InsightTypeFaultLine:
			description = "Pattern suggests a previously undetected fault line running through this region."
			recommendation = "Further structural analysis recommended to determine fault characteristics."
		}

		// Create insight
		insights[i] = models.AIInsight{
			ID:        generateInsightID(),
			Timestamp: time.Now().Format(time.RFC3339),
			Type:      insightType,
			Location: models.Position{
				X: x,
				Y: y,
				Z: z,
			},
			LayerID:        layerID,
			Confidence:     confidence,
			Description:    description,
			Recommendation: recommendation,
			Severity:       severity,
		}
	}

	return insights
}

// generateInsightID creates a unique ID for insights
func generateInsightID() string {
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	id := "ins_"
	for i := 0; i < 8; i++ {
		id += string(charset[rand.Intn(len(charset))])
	}
	return id
}
