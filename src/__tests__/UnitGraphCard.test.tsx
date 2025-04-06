import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import UnitGraphCard from '../panels/unitInfoPanel/UnitGraphCard';
import unitReducer from '../store/unitSlice';
import simulationReducer from '../store/simulationSlice';
import { RootState } from '../store';
import '@testing-library/jest-dom';

jest.mock('echarts-for-react', () => ({
  __esModule: true,
  default: () => <div data-testid="mocked-chart">Mocked Chart</div>
}));

describe('UnitGraphCard Component', () => {
  const createTestStore = (initialState: Partial<RootState>) => {
    return configureStore({
      reducer: {
        unit: unitReducer,
        simulation: simulationReducer
      },
      preloadedState: initialState as any
    });
  };

  const mockPositionHistory = [
    { timestamp: '2023-10-15T10:00:00Z', lat: 39.933, lng: 32.859 },
    { timestamp: '2023-10-15T10:05:00Z', lat: 39.935, lng: 32.860 },
    { timestamp: '2023-10-15T10:10:00Z', lat: 39.936, lng: 32.862 }
  ];

  const mockCurrentPosition = {
    timestamp: '2023-10-15T10:15:00Z',
    lat: 39.938,
    lng: 32.864
  };

  test('renders nothing with no selected units', () => {
    const initialState = {
      unit: { selectedUnits: [] },
      simulation: { units: [] }
    };
    
    const store = createTestStore(initialState);
    const { container } = render(
      <Provider store={store}>
        <UnitGraphCard />
      </Provider>
    );
    
    expect(container.firstChild).toBeNull();
  });

  test('renders chart when unit is selected', () => {
    const initialState = {
      unit: {
        selectedUnits: [
          { id: 1, name: 'Test Unit', type: 'drone', speed: 10, course: 45 }
        ]
      },
      simulation: {
        units: [
          {
            id: 1,
            name: 'Test Unit',
            type: 'drone',
            currentPosition: mockCurrentPosition,
            positionHistory: mockPositionHistory,
            speed: 10,
            course: 45
          }
        ]
      }
    };
    
    const store = createTestStore(initialState);
    const { getByTestId } = render(
      <Provider store={store}>
        <UnitGraphCard />
      </Provider>
    );
    
    expect(getByTestId('mocked-chart')).toBeInTheDocument();
  });

  test('renders chart with empty position history', () => {
    const initialState = {
      unit: {
        selectedUnits: [
          { id: 1, name: 'Test Unit', type: 'drone', speed: 10, course: 45 }
        ]
      },
      simulation: {
        units: [
          {
            id: 1,
            name: 'Test Unit',
            type: 'drone',
            currentPosition: mockCurrentPosition,
            positionHistory: [],
            speed: 10,
            course: 45
          }
        ]
      }
    };
    
    const store = createTestStore(initialState);
    const { getByTestId } = render(
      <Provider store={store}>
        <UnitGraphCard />
      </Provider>
    );
    
    expect(getByTestId('mocked-chart')).toBeInTheDocument();
  });
}); 