# ReactThreeGoAI Development Guide

## Getting Started

This document provides guidelines and instructions for developers working on ReactThreeGoAI.

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18+)
- Go (v1.18+)
- Git
- VSCode or your preferred IDE
- Terraform (for deployment only)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/reactthreegoai.git
cd reactthreegoai
```

2. Install dependencies:
```bash
npm install
```

3. Install Go dependencies:
```bash
cd server
go mod download
cd ..
```

### Running the Application

Start the development server with:

```bash
npm run dev
```

This will start:
- The Node.js proxy server on port 5000
- The Vite development server for the React frontend
- The Go backend server on port 8080 (if available)

The application will be accessible at: http://localhost:5000/

### Project Structure

```
/
├── client/                    # Frontend code
│   ├── public/                # Static assets
│   │   └── textures/          # 3D textures
│   └── src/                   # React source code
│       ├── components/        # React components
│       │   └── ui/            # Reusable UI components
│       ├── hooks/             # Custom React hooks
│       ├── lib/               # Utilities and state management
│       │   └── stores/        # Zustand state stores
│       ├── types/             # TypeScript type definitions
│       └── pages/             # Page components
├── server/                    # Backend code
│   ├── handlers/              # API route handlers
│   ├── models/                # Data models
│   ├── index.ts               # Node.js proxy entry point
│   ├── main.go                # Go backend entry point
│   └── routes.ts              # API route definitions
├── shared/                    # Shared code
│   └── schema.ts              # Shared schema definitions
└── terraform/                 # Deployment configuration
```

## Development Workflow

### Feature Development Process

1. **Create a feature branch**: 
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Implement your changes**: Follow the coding standards and architecture guidelines

3. **Test your changes**: Ensure all tests pass and manual testing confirms functionality

4. **Create a pull request**: Submit a PR with a clear description of changes

### Code Standards

#### JavaScript/TypeScript

- Use TypeScript for all new code
- Follow ESLint rules configured in the project
- Use async/await instead of Promise chains
- Prefer functional programming patterns when appropriate

#### React Components

- Use functional components with hooks
- Keep components small and focused on a single responsibility
- Use prop types or TypeScript interfaces for component props
- Avoid unnecessary re-renders by using React.memo when appropriate

#### State Management

- Use Zustand for global state management
- Keep store definitions clean and well-typed
- Store only necessary state in global stores
- Use local state (useState) for component-specific state

#### 3D Development

- Follow Three.js best practices for performance
- Use React Three Fiber hooks and patterns
- Optimize 3D objects to minimize draw calls
- Use instancing for repeated objects

## Key Features and Implementation Details

### Terrain Visualization

The terrain visualization is implemented using React Three Fiber with the following key components:

- `TerrainViewer.tsx`: Main container component for the 3D visualization
- `TerrainScene.tsx`: Contains the 3D scene with terrain, lights, camera
- `TerrainLayer.tsx`: Renders a single geological layer with appropriate material

The terrain data is loaded through the API and stored in the TerrainStore.

### Visualization Controls

Interactive controls are implemented through the `InteractiveControls.tsx` component, which uses the VisualizationStore to manage settings like:

- Lighting intensity
- Wireframe mode
- Vertical exaggeration
- Property-based coloring

### View Modes

The platform supports multiple visualization modes:

1. **Default View**: Standard visualization with layer colors and textures
2. **X-Ray View**: Semi-transparent wireframe view to see through layers
3. **Composition View**: Coloring based on material composition
4. **Density Analysis**: Coloring based on density values

These modes are implemented by adjusting material properties in the TerrainLayer component.

## Extending the Application

### Adding a New Feature

To add a new feature to the application:

1. **Plan your feature**: Determine which components and stores need to be modified
2. **Update the appropriate stores**: Add new state variables and actions
3. **Create or update components**: Implement the UI and functionality
4. **Add API endpoints**: Implement any required backend functionality
5. **Test thoroughly**: Ensure the feature works correctly in all scenarios

### Adding a New Visualization Mode

To add a new visualization mode:

1. Update the `VIEW_MODES` constant in `InteractiveControls.tsx`:
```typescript
const VIEW_MODES: ViewMode[] = [
  // Existing modes...
  { type: 'your_new_mode', name: 'Your New Mode Name' },
];
```

2. Add case handling in `getVisualizationProps` function in `TerrainViewer.tsx`:
```typescript
const getVisualizationProps = () => {
  switch (viewMode.type) {
    // Existing cases...
    case 'your_new_mode':
      return {
        // Define visualization properties for your mode
        specialEffect: true,
        colorByProperty: 'your_property'
      };
    default:
      // Default case...
  }
};
```

3. Update the `getMaterialProps` function in `TerrainLayer.tsx` to handle your new mode:
```typescript
const getMaterialProps = () => {
  // Existing code...
  switch (viewMode.type) {
    // Existing cases...
    case 'your_new_mode':
      return {
        // Define material properties for your mode
        color: specialColor,
        metalness: 0.5,
        roughness: 0.2,
        // Other properties...
      };
    default:
      // Default case...
  }
};
```

### Adding New Analysis Capabilities

To add a new analysis type:

1. Implement the analysis algorithm in the Go backend
2. Add a new route handler for the analysis type
3. Update the frontend to call the new analysis API
4. Implement visualization for the analysis results

## Testing

### Unit Testing

Run unit tests with:

```bash
npm test
```

When writing tests:
- Test components with React Testing Library
- Test stores with simple state manipulation tests
- Mock API calls to avoid external dependencies

### Manual Testing

When testing manually, check:
- All view modes and visualization controls
- Layer selection and visibility controls
- Performance with large terrain datasets
- Error handling with invalid data or server errors

## Deployment

### Development Deployment

For development testing, you can build and start the production server:

```bash
npm run build
npm start
```

### Production Deployment

For production deployment, use Terraform:

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

This will deploy the application to AWS EC2 instances.

### Environment Configuration

Configure environment variables for different environments:

- `.env.development`: Development environment variables
- `.env.production`: Production environment variables

## Troubleshooting

### Common Issues

#### Terrain Not Rendering

- Check if terrain data is being loaded correctly from the API
- Verify that camera position is set appropriately
- Check for console errors related to Three.js

#### Go Backend Connection Issues

- Ensure the Go server is running on port 8080
- Check the Node.js proxy logs for connection errors
- Verify that proxy forwarding is configured correctly

#### Visualization Controls Not Working

- Check if the VisualizationStore is updating correctly
- Verify that props are being passed correctly to TerrainLayer
- Check for console errors in event handlers

## Additional Resources

- [React Three Fiber Documentation](https://docs.pmnd.rs/react-three-fiber/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Go API Development Guide](https://golang.org/doc/tutorial/web-service-gin)
- [Terraform AWS Provider Documentation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)

## Contributing

Please follow the contribution guidelines in CONTRIBUTING.md when submitting changes to the project.