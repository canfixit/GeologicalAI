import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Terrain data endpoint
  app.get("/api/terrain", (req, res) => {
    try {
      // Fetch terrain data from Go backend
      fetch("http://localhost:8000/api/terrain")
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch terrain data from backend');
          }
          return response.json();
        })
        .then(data => {
          res.json(data);
        })
        .catch(error => {
          console.error("Error fetching terrain data:", error);
          res.status(500).json({ message: "Failed to fetch terrain data" });
        });
    } catch (error) {
      console.error("Error in terrain endpoint:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // AI Insights endpoint
  app.get("/api/insights", (req, res) => {
    try {
      // Fetch insights from Go backend
      fetch("http://localhost:8000/api/insights")
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch insights from backend');
          }
          return response.json();
        })
        .then(data => {
          res.json(data);
        })
        .catch(error => {
          console.error("Error fetching insights:", error);
          res.status(500).json({ message: "Failed to fetch insights" });
        });
    } catch (error) {
      console.error("Error in insights endpoint:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Run new analysis endpoint
  app.post("/api/insights/analyze", (req, res) => {
    try {
      // Call Go backend to run new analysis
      fetch("http://localhost:8000/api/insights/analyze", {
        method: "POST"
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to run new analysis');
          }
          return response.json();
        })
        .then(data => {
          res.json(data);
        })
        .catch(error => {
          console.error("Error running new analysis:", error);
          res.status(500).json({ message: "Failed to run new analysis" });
        });
    } catch (error) {
      console.error("Error in analyze endpoint:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
