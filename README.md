# ReactThreeGoAI

A geological visualization platform for AI-powered terrain analysis, enabling researchers and analysts to explore complex geological data through interactive 3D visualizations and advanced control mechanisms.

## Features

- Interactive 3D terrain visualization with layer-based geological models
- AI-powered insights for anomaly detection and resource identification
- Advanced visualization controls (lighting, wireframe, vertical exaggeration)
- Property-based coloring to visualize density, porosity, and permeability
- Multiple view modes (Default, X-Ray, Composition, Density)
- Drill point markers with detailed metadata

## Tech Stack

- **Frontend**: React with TypeScript, Three.js (via React Three Fiber)
- **Backend**: Go API with Node.js proxy
- **State Management**: Zustand for reactive state
- **Styling**: Tailwind CSS with custom UI components
- **Deployment**: AWS EC2 (via Terraform)

## Getting Started

### Prerequisites

- Node.js (v18+)
- Go (v1.18+)
- Git

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

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5000
```

## Documentation

- [API Documentation](./API.md) - Detailed API endpoints and usage
- [Development Guide](./DEVELOPMENT.md) - Setup instructions and coding standards
- [Code Wiki](./WIKI.md) - Architecture overview and code relationships

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.