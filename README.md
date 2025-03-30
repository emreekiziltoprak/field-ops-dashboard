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

```bash
yarn test
```

## Project Structure

```
src/
├── assets/         # Static files like images, fonts, etc.
├── components/     # Reusable UI components
├── features/       # Feature-specific components and logic
├── hooks/          # Custom React hooks
├── service/        # API and service layer
├── store/          # State management (Redux/Context)
├── types/          # TypeScript type definitions
├── __tests__/      # Test files
├── App.tsx         # Main App component
├── main.tsx        # Application entry point
├── App.css         # App-specific styles
├── index.css       # Global styles
└── vite-env.d.ts   # Vite type declarations
```