import { configureStore } from '@reduxjs/toolkit';
import unitReducer from '../store/unitSlice';

describe('Unit Slice', () => {
  const createTestStore = () => {
    return configureStore({
      reducer: {
        unit: unitReducer
      }
    });
  };

  const sampleUnit1 = {
    id: '1',
    name: 'Drone Alpha',
    type: 'drone',
    speed: 10,
    course: 45
  };
  
  const sampleUnit2 = {
    id: '2',
    name: 'Vehicle Bravo',
    type: 'vehicle',
    speed: 5,
    course: 90
  };

  test('has empty initial state', () => {
    const store = createTestStore();
    expect(store.getState().unit.selectedUnits).toEqual([]);
  });

  test('adds unit to selection', () => {
    const store = createTestStore();
    store.dispatch({ type: 'unit/selectUnit', payload: sampleUnit1 });
    
    const state = store.getState().unit;
    expect(state.selectedUnits.length).toBe(1);
    expect(state.selectedUnits[0].id).toBe(sampleUnit1.id);
    expect(state.selectedUnits[0].name).toBe(sampleUnit1.name);
  });

  test('prevents duplicate selections', () => {
    const store = createTestStore();
    
    store.dispatch({ type: 'unit/selectUnit', payload: sampleUnit1 });
    store.dispatch({ type: 'unit/selectUnit', payload: sampleUnit1 });
    
    expect(store.getState().unit.selectedUnits.length).toBe(1);
  });

  test('selects multiple units', () => {
    const store = createTestStore();
    
    store.dispatch({ type: 'unit/selectUnit', payload: sampleUnit1 });
    store.dispatch({ type: 'unit/selectUnit', payload: sampleUnit2 });
    
    const state = store.getState().unit;
    expect(state.selectedUnits.length).toBe(2);
  });

  test('deselects specific unit', () => {
    const store = createTestStore();
    
    store.dispatch({ type: 'unit/selectUnit', payload: sampleUnit1 });
    store.dispatch({ type: 'unit/selectUnit', payload: sampleUnit2 });
    store.dispatch({ type: 'unit/deselectUnit', payload: sampleUnit1.id });
    
    const state = store.getState().unit;
    expect(state.selectedUnits.length).toBe(1);
    expect(state.selectedUnits[0].id).toBe(sampleUnit2.id);
  });

  test('clears all selections', () => {
    const store = createTestStore();
    
    store.dispatch({ type: 'unit/selectUnit', payload: sampleUnit1 });
    store.dispatch({ type: 'unit/selectUnit', payload: sampleUnit2 });
    store.dispatch({ type: 'unit/clearSelectedUnits' });
    
    expect(store.getState().unit.selectedUnits.length).toBe(0);
  });
  
  test('replaces current selection', () => {
    const store = createTestStore();
    
    store.dispatch({ type: 'unit/selectUnit', payload: sampleUnit1 });
    store.dispatch({ type: 'unit/setSelectedUnits', payload: [sampleUnit2] });
    
    const state = store.getState().unit;
    expect(state.selectedUnits.length).toBe(1);
    expect(state.selectedUnits[0].id).toBe(sampleUnit2.id);
  });
}); 