# ReactThreeGoAI API Documentation

## Overview

ReactThreeGoAI exposes several REST APIs to interact with terrain data, insights, and analysis features. The API is implemented using a Go backend with a Node.js proxy layer for fallback capabilities.

## Base URL

All API endpoints are relative to the base URL of your deployment:

- Development: `http://localhost:5000/api`
- Production: `https://your-deployment-url.com/api`

## Authentication

Currently, the API does not require authentication for most endpoints. Future versions will implement JWT-based authentication.

## Endpoints

### Terrain Data

#### GET /terrain

Retrieves the terrain data including layers, dimensions, and drill points.

**Request:**
```
GET /api/terrain
```

**Response:**
```json
{
  "id": "terrain-1",
  "name": "Sample Geological Formation",
  "dimensions": {
    "width": 500,
    "height": 100,
    "depth": 500
  },
  "layers": [
    {
      "id": "layer-1",
      "name": "Topsoil",
      "depth": 0,
      "thickness": 5,
      "color": "#8B4513",
      "material": "soil",
      "opacity": 1.0,
      "metadata": {
        "age": "Recent",
        "composition": "Organic matter and minerals",
        "porosity": 0.5,
        "permeability": 0.4,
        "density": 1.4
      },
      "visible": true
    },
    {
      "id": "layer-2",
      "name": "Clay",
      "depth": 5,
      "thickness": 10,
      "color": "#CD853F",
      "material": "clay",
      "opacity": 1.0,
      "metadata": {
        "age": "Quaternary",
        "composition": "Kaolinite and illite",
        "porosity": 0.1,
        "permeability": 0.02,
        "density": 2.1
      },
      "visible": true
    }
    // Additional layers...
  ],
  "drillPoints": [
    {
      "id": "drill-1",
      "name": "Drill Site Alpha",
      "position": {
        "x": 100,
        "y": 0,
        "z": 100
      },
      "metadata": {
        "date": "2025-03-15",
        "depth": 75,
        "sampleData": "Sandstone with trace fossils"
      }
    }
    // Additional drill points...
  ]
}
```

**Status Codes:**
- `200 OK`: Successfully returned terrain data
- `404 Not Found`: Terrain data not found
- `500 Internal Server Error`: Server error

### AI Insights

#### GET /insights

Retrieves AI-generated insights for the current terrain data.

**Request:**
```
GET /api/insights
```

**Query Parameters:**
- `terrainId` (optional): ID of the terrain to get insights for
- `limit` (optional): Maximum number of insights to return (default: 20)
- `type` (optional): Filter by insight type (e.g., 'anomaly', 'potential_resource')

**Response:**
```json
[
  {
    "id": "insight-1",
    "timestamp": "2025-05-12T10:30:00Z",
    "type": "potential_resource",
    "location": {
      "x": 120,
      "y": 45,
      "z": 150
    },
    "layerId": "layer-4",
    "confidence": 0.86,
    "description": "High probability of hydrocarbon accumulation in sandstone layer",
    "recommendation": "Consider exploratory drilling at this location",
    "severity": "medium"
  },
  {
    "id": "insight-2",
    "timestamp": "2025-05-12T10:30:05Z",
    "type": "structural_weakness",
    "location": {
      "x": 250,
      "y": 30,
      "z": 300
    },
    "layerId": "layer-3",
    "confidence": 0.72,
    "description": "Potential fault line detected with significant displacement",
    "recommendation": "Monitor for stability issues in this region",
    "severity": "high"
  }
  // Additional insights...
]
```

**Status Codes:**
- `200 OK`: Successfully returned insights
- `400 Bad Request`: Invalid parameters
- `500 Internal Server Error`: Server error

### Analysis

#### POST /analysis/run

Runs an analysis on the terrain data.

**Request:**
```
POST /api/analysis/run
```

**Request Body:**
```json
{
  "terrainId": "terrain-1",
  "analysisType": "resource_potential",
  "parameters": {
    "resourceType": "petroleum",
    "confidenceThreshold": 0.7,
    "includeLayers": ["layer-3", "layer-4", "layer-5"]
  }
}
```

**Response:**
```json
{
  "analysisId": "analysis-1234",
  "status": "running",
  "estimatedCompletionTime": "2025-05-12T11:45:00Z"
}
```

**Status Codes:**
- `202 Accepted`: Analysis job has been accepted and is running
- `400 Bad Request`: Invalid parameters
- `500 Internal Server Error`: Server error

#### GET /analysis/{analysisId}

Retrieves the results of a previously submitted analysis.

**Request:**
```
GET /api/analysis/analysis-1234
```

**Response:**
```json
{
  "analysisId": "analysis-1234",
  "status": "completed",
  "startTime": "2025-05-12T11:30:00Z",
  "completionTime": "2025-05-12T11:42:15Z",
  "results": {
    "resourcePotentialMap": [
      {
        "location": {
          "x": 150,
          "y": 45,
          "z": 200
        },
        "potentialScore": 0.92,
        "resourceType": "petroleum",
        "volumeEstimate": "2.3M barrels",
        "confidenceInterval": "±0.5M barrels"
      },
      // Additional results...
    ],
    "summary": {
      "highPotentialAreas": 3,
      "totalVolume": "7.8M barrels",
      "recommendedNextSteps": "Further seismic analysis in northeast quadrant"
    }
  }
}
```

**Status Codes:**
- `200 OK`: Successfully returned analysis results
- `202 Accepted`: Analysis is still running
- `404 Not Found`: Analysis ID not found
- `500 Internal Server Error`: Server error

### Data Manipulation

#### PATCH /terrain/layers/{layerId}

Updates properties of a specific terrain layer.

**Request:**
```
PATCH /api/terrain/layers/layer-2
```

**Request Body:**
```json
{
  "name": "Updated Layer Name",
  "color": "#A52A2A",
  "opacity": 0.8,
  "visible": false
}
```

**Response:**
```json
{
  "id": "layer-2",
  "name": "Updated Layer Name",
  "depth": 5,
  "thickness": 10,
  "color": "#A52A2A",
  "material": "clay",
  "opacity": 0.8,
  "metadata": {
    "age": "Quaternary",
    "composition": "Kaolinite and illite",
    "porosity": 0.1,
    "permeability": 0.02,
    "density": 2.1
  },
  "visible": false
}
```

**Status Codes:**
- `200 OK`: Successfully updated the layer
- `400 Bad Request`: Invalid parameters
- `404 Not Found`: Layer ID not found
- `500 Internal Server Error`: Server error

## Error Handling

All API endpoints return errors in a consistent format:

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested resource could not be found",
    "details": {
      "resourceId": "layer-999",
      "resourceType": "terrain_layer"
    }
  }
}
```

## Websocket API

For real-time updates during analysis and simulations, connect to the WebSocket endpoint:

```
ws://localhost:5000/ws
```

### Message Types

#### Analysis Progress Update

```json
{
  "type": "analysis_progress",
  "analysisId": "analysis-1234",
  "progress": 0.45,
  "status": "running",
  "message": "Processing layer 2 of 5"
}
```

#### Insight Notification

```json
{
  "type": "new_insight",
  "insight": {
    "id": "insight-42",
    "timestamp": "2025-05-12T12:05:00Z",
    "type": "anomaly",
    "location": {
      "x": 320,
      "y": 70,
      "z": 180
    },
    "layerId": "layer-5",
    "confidence": 0.91,
    "description": "Unexpected density variation detected",
    "severity": "medium"
  }
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:

- 100 requests per minute per IP address
- 1000 requests per hour per IP address

Exceeding these limits will result in a `429 Too Many Requests` response.

## Versioning

The current API version is v1. The version can be specified in the URL:

```
GET /api/v1/terrain
```

If no version is specified, the latest version is used.