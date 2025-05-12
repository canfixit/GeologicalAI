# ReactThreeGoAI - Code Wiki

## Infrastructure Overview

ReactThreeGoAI is a modern web application that provides interactive 3D visualization of geological terrain data with advanced analysis capabilities.

### Tech Stack

- **Frontend**: React with TypeScript, Three.js (via React Three Fiber)
- **Backend**: Go API with Node.js proxy 
- **State Management**: Zustand for reactive state
- **Styling**: Tailwind CSS with custom UI components
- **Deployment**: AWS EC2 (via Terraform)

### System Architecture

The platform follows a layered architecture with the following components:

1. **Presentation Layer** - React components and 3D visualization
2. **State Management Layer** - Zustand stores
3. **Data Access Layer** - API clients and query management
4. **Backend Services** - Go API for data processing and AI insights
5. **Proxy Layer** - Node.js service that forwards requests to Go backend

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Browser                          │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                   React/Three.js Frontend                   │
│                                                             │
│  ┌─────────────┐   ┌──────────────┐   ┌──────────────────┐  │
│  │    Stores   │   │  Components  │   │  3D Terrain View │  │
│  └─────────────┘   └──────────────┘   └──────────────────┘  │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                      Node.js Proxy                          │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                        Go Backend                           │
│                                                             │
│  ┌─────────────┐   ┌──────────────┐   ┌──────────────────┐  │
│  │ Terrain API │   │ Insights API │   │  Analysis Engine │  │
│  └─────────────┘   └──────────────┘   └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Code Structure and Relationships

### Frontend Code Structure

- `/client`: Contains all frontend code 
  - `/src`
    - `/components`: React components 
      - `/ui`: Reusable UI components (buttons, inputs, etc.)
      - `TerrainViewer.tsx`: Main 3D visualization component
      - `TerrainLayer.tsx`: Single terrain layer visualization
      - `InteractiveControls.tsx`: UI for visualization settings
    - `/lib`: Utility code and state management
      - `/stores`: Zustand state stores
    - `/hooks`: Custom React hooks
    - `/types`: TypeScript type definitions
    - `/pages`: Page components
  - `/public`: Static assets including textures

### Backend Code Structure

- `/server`: Contains all backend code
  - `/handlers`: API route handlers
  - `/models`: Data models and schemas
  - `index.ts`: Entry point for Node.js proxy server
  - `routes.ts`: API route definitions
  - `storage.ts`: Data storage interfaces
  - `vite.ts`: Vite configuration for server
  - `main.go`: Entry point for Go server

### Shared Code

- `/shared`: Code shared between frontend and backend
  - `schema.ts`: Database schema definitions

### Deployment Code

- `/terraform`: Terraform configuration for AWS deployment

## Key Component Relationships

### Store Relationships

The application uses multiple Zustand stores to manage state:

1. **TerrainStore**
   - Manages terrain data, selected layers, camera position
   - Interfaces with the API to load terrain data and AI insights

2. **UIStore**
   - Manages UI state like dark mode, sidebar visibility
   - Controls which panels are open/closed

3. **VisualizationStore**
   - Manages visualization settings like lighting, wireframe mode
   - Controls how the terrain data is displayed

4. **AudioStore**
   - Manages sound effects and background music

These stores are independent but coordinated through component connections.

### Component Hierarchy

```
App
├── Navbar
├── Landing (when appMode="landing")
└── TerrainViewer (when appMode="viewer")
    ├── TerrainScene
    │   ├── TerrainLayer (multiple)
    │   └── DrillPointMarker (multiple)
    └── InteractiveControls
        ├── LayersTab
        ├── ViewTab
        └── LightingTab
```

## API Descriptions

### Terrain API

#### GET /api/terrain
Returns terrain data including layers, dimensions, and drill points.

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "dimensions": {
    "width": "number",
    "height": "number",
    "depth": "number"
  },
  "layers": [
    {
      "id": "string",
      "name": "string",
      "depth": "number",
      "thickness": "number",
      "color": "string",
      "material": "string",
      "opacity": "number",
      "metadata": {
        "age": "string",
        "composition": "string",
        "porosity": "number",
        "permeability": "number",
        "density": "number"
      },
      "visible": "boolean"
    }
  ],
  "drillPoints": [
    {
      "id": "string",
      "name": "string",
      "position": {
        "x": "number",
        "y": "number",
        "z": "number"
      },
      "metadata": {
        "date": "string",
        "depth": "number",
        "sampleData": "string"
      }
    }
  ]
}
```

#### GET /api/insights
Returns AI-generated insights for the terrain data.

**Response:**
```json
[
  {
    "id": "string",
    "timestamp": "string",
    "type": "anomaly|potential_resource|structural_weakness|density_variation|fault_line",
    "location": {
      "x": "number",
      "y": "number",
      "z": "number"
    },
    "layerId": "string",
    "confidence": "number",
    "description": "string",
    "recommendation": "string",
    "severity": "low|medium|high"
  }
]
```

#### POST /api/analysis/run
Runs an analysis on the terrain data.

**Request:**
```json
{
  "terrainId": "string",
  "analysisType": "string",
  "parameters": {}
}
```

**Response:**
```json
{
  "analysisId": "string",
  "status": "running|completed|failed",
  "results": {}
}
```

## Visualization Features

### View Modes

1. **Default View**: Standard visualization with layer colors and textures
2. **X-Ray View**: Semi-transparent wireframe view to see through layers
3. **Composition View**: Coloring based on material composition
4. **Density Analysis**: Coloring based on density values

### Interactive Controls

1. **Layer Controls**
   - Toggle layer visibility
   - Select layers for information display
   - Adjust vertical exaggeration

2. **View Controls**
   - Switch between view modes
   - Toggle wireframe mode
   - Show/hide labels and coordinate axes
   - Set property-based coloring

3. **Lighting Controls**
   - Adjust main light intensity
   - Adjust ambient light intensity

## Development Guidelines

### Adding a New Layer Type

1. Update the `TerrainLayer` interface in `types/terrain.ts`
2. Add material and texture handling in `TerrainLayer.tsx`
3. Add any special rendering logic for the new layer type

### Adding a New Visualization Mode

1. Add the new mode to the `VIEW_MODES` constant in `InteractiveControls.tsx`
2. Add a case for the new mode in the `getVisualizationProps` function in `TerrainViewer.tsx`
3. Update the `getMaterialProps` function in `TerrainLayer.tsx` to handle the new mode

### Adding a New Analysis Type

1. Add the new analysis type to the Go backend's analysis engine
2. Update the `/api/analysis/run` endpoint to support the new type
3. Add UI components to display the results of the analysis

## Terraform Deployment Configuration

The application is deployed to AWS EC2 instances using Terraform. The Terraform configuration includes:

1. EC2 instance configuration with security groups
2. Load balancer setup for high availability
3. Database configuration for storing analysis results

To deploy the application:

1. Configure your AWS credentials
2. Run `terraform init` to initialize the Terraform environment
3. Run `terraform apply` to create the infrastructure

## Debugging Tips

### Common Issues

1. **Terrain doesn't render**: Check if the terrain data is loading properly from the API
2. **Controls don't update the visualization**: Verify that the visualization store is properly connected
3. **Layer selection doesn't work**: Check event propagation in the TerrainLayer component

### Useful Debugging Tools

1. Zustand `devtools` middleware for inspecting store state
2. React Three Fiber's `<Stats />` component for performance monitoring
3. Browser developer tools for network request inspection