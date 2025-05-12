package main

import (
        "fmt"
        "geosphere/handlers"
        "log"
        "net/http"
        "os"

        "github.com/gorilla/mux"
        "github.com/rs/cors"
)

func main() {
        // Create a new router
        r := mux.NewRouter()

        // Register API endpoints
        r.HandleFunc("/api/terrain", handlers.GetTerrainData).Methods("GET")
        r.HandleFunc("/api/insights", handlers.GetInsights).Methods("GET")
        r.HandleFunc("/api/insights/analyze", handlers.RunAnalysis).Methods("POST")

        // Configure CORS
        c := cors.New(cors.Options{
                AllowedOrigins:   []string{"*"},
                AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
                AllowedHeaders:   []string{"Content-Type", "Authorization"},
                AllowCredentials: true,
        })

        // Use CORS middleware
        handler := c.Handler(r)

        // Get port from environment or use default
        port := os.Getenv("PORT")
        if port == "" {
                port = "8080"
        }

        // Start the server
        fmt.Printf("Starting Go backend server on port %s...\n", port)
        log.Fatal(http.ListenAndServe("0.0.0.0:"+port, handler))
}
