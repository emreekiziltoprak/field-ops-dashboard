# Field Ops Dashboard

A command and control panel developed for mission area management and real-time tracking.
Allows users to draw mission zones on the map, track field units (e.g., drones, vehicles, teams), and analyze distance data based on historical movement.

## Features

- Mission zone drawing via polygon shapes on the map (CesiumJS)
- Real-time tracking of units on the field
- Historical route and distance analysis using charts (ECharts)
- Mission metadata definition and searchable list
- Enterprise-grade UI using BlueprintJS components
- Jest-based unit testing setup with initial component test

## Tech Stack

| Layer         | Technology                        |
|---------------|-----------------------------------|
| UI Framework  | React + TypeScript + SWC          |
| Map Engine    | CesiumJS + vite-plugin-cesium     |
| State         | Redux Toolkit                     |
| UI Components | BlueprintJS                       |
| Charting      | ECharts                           |
| Forms         | Formik + Yup                      |
| Testing       | Jest Testing Library      |
| Build Tool    | Vite                              |

## For Getting Started

```bash
To install dependencies: yarn
To start development server: yarn dev
```

> If a Cesium access token is required, create a `.env` file and set the following:

```env
VITE_CESIUM_TOKEN=your_access_token
```

## Testing

The Field Ops Dashboard has a comprehensive test suite using Jest and React Testing Library. The main focus areas for testing include:

### Core Tests

- **PositionCalculator**: Tests the mathematical calculations that power the unit movement simulation
- **Redux State Management**: Tests for mission and unit state reducers and actions
- **Component Tests**: Tests for key UI components like the UnitGraphCard
- **Hook Tests**: Tests for custom hooks like usePolygonDraw

### Running Tests

```bash
# Run all tests
yarn test

# Run tests in watch mode during development
yarn test:watch

# Generate test coverage report
yarn test:coverage
```

### Test Coverage Goals

The project aims for 70% code coverage across:
- Branches
- Functions
- Lines
- Statements

### Testing Approaches

1. **Unit Tests**: Testing individual functions, hooks and small components in isolation
2. **Integration Tests**: Testing how components work together with Redux
3. **Snapshot Testing**: Ensuring UI components maintain their expected output
4. **Mock Testing**: Using mock functions for external dependencies (e.g., Cesium)

### Adding New Tests

When adding new features, we follow a test-driven development approach:
1. Write tests that define the expected behavior
2. Implement the feature to satisfy the tests
3. Refactor while ensuring tests continue to pass

## Project Structure

```
src/
├── assets/         # Static files like images, fonts, etc.
├── components/     # Reusable UI components
├── features/       # Feature-specific components and logic
│   ├── map/        # Map visualization and interaction
│   ├── mission/    # Mission management features
│   ├── unit/       # Unit tracking and information
│   └── draw/       # Drawing tools for map
├── layouts/        # Layout components
│   └── bottomBar/  # Bottom bar UI component
├── lib/            # Utility libraries and helpers
├── mock/           # Mock data for development and testing
├── panels/         # Panel components for the dashboard
├── service/        # API and service layer
├── store/          # State management (Redux)
├── types/          # TypeScript type definitions
├── __tests__/      # Jest test files
├── test/           # Test utilities and helpers
├── App.tsx         # Main App component
├── App.scss        # App styles including theme configuration
├── main.tsx        # Application entry point
├── index.css       # Global styles
└── vite-env.d.ts   # Vite type declarations
```