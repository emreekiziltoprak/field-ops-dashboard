import { configureStore } from '@reduxjs/toolkit';
import missionReducer, { 
  addMission, 
  selectMission, 
  setDrawingMode,
  selectMissionObj,
  Mission 
} from '../store/missionSlice';

describe('Mission Slice', () => {
  // Setup a test store with the mission reducer
  const createTestStore = () => {
    return configureStore({
      reducer: {
        mission: missionReducer
      }
    });
  };

  // Sample mission data
  const sampleMission: Mission = {
    id: 'test-mission-1',
    name: 'Test Mission',
    type: 'Surveillance',
    startTime: '2023-10-15T10:00',
    endTime: '2023-10-15T12:00',
    coordinates: [
      { lat: 39.933, lng: 32.859 },
      { lat: 39.935, lng: 32.860 },
      { lat: 39.936, lng: 32.858 }
    ]
  };

  test('initial state is empty', () => {
    const store = createTestStore();
    const state = store.getState().mission;
    
    expect(state.missions).toEqual([]);
    expect(state.selectedMissionId).toBeNull();
    expect(state.drawingMode).toBe(false);
    expect(state.selectedMission).toBeNull();
  });

  test('adds mission to store', () => {
    const store = createTestStore();
    
    store.dispatch(addMission(sampleMission));
    
    const state = store.getState().mission;
    expect(state.missions.length).toBe(1);
    expect(state.missions[0].id).toBe(sampleMission.id);
    expect(state.missions[0].name).toBe(sampleMission.name);
  });

  test('selects mission by ID', () => {
    const store = createTestStore();
    
    store.dispatch(addMission(sampleMission));
    store.dispatch(selectMission(sampleMission.id));
    
    const state = store.getState().mission;
    expect(state.selectedMissionId).toBe(sampleMission.id);
  });

  test('selects mission object', () => {
    const store = createTestStore();
    
    store.dispatch(addMission(sampleMission));
    
    store.dispatch(selectMissionObj(sampleMission));
    
    const state = store.getState().mission;
    expect(state.selectedMission).toEqual(sampleMission);
  });

  test('toggles drawing mode', () => {
    const store = createTestStore();
    
    expect(store.getState().mission.drawingMode).toBe(false);
    
    store.dispatch(setDrawingMode(true));
    expect(store.getState().mission.drawingMode).toBe(true);
    
    store.dispatch(setDrawingMode(false));
    expect(store.getState().mission.drawingMode).toBe(false);
  });

  test('adds multiple missions', () => {
    const store = createTestStore();
    
    store.dispatch(addMission(sampleMission));
    
    const secondMission = {
      ...sampleMission,
      id: 'test-mission-2',
      name: 'Second Mission'
    };
    
    store.dispatch(addMission(secondMission));
    
    const state = store.getState().mission;
    expect(state.missions.length).toBe(2);
    expect(state.missions[0].id).toBe(sampleMission.id);
    expect(state.missions[1].id).toBe(secondMission.id);
  });

  test('should remove a mission', () => {
    const store = createTestStore();
    
    store.dispatch(addMission(sampleMission));
    const secondMission: Mission = {
      ...sampleMission,
      id: 'test-mission-2',
      name: 'Second Mission'
    };
    store.dispatch(addMission(secondMission));
    
    expect(store.getState().mission.missions.length).toBe(2);
    
    
    // Verify only the second mission remains
    const updatedMissions = store.getState().mission.missions;
    expect(updatedMissions.length).toBe(1);
    expect(updatedMissions[0].id).toBe(secondMission.id);
  });

  test('should handle removing a mission that does not exist', () => {
    const store = createTestStore();
    
    // Add a mission
    store.dispatch(addMission(sampleMission));
    expect(store.getState().mission.missions.length).toBe(1);
    
    // The state should remain unchanged
    expect(store.getState().mission.missions.length).toBe(1);
    expect(store.getState().mission.missions[0].id).toBe(sampleMission.id);
  });

  test('should clear selectedMissionId when selected mission is removed', () => {
    const store = createTestStore();
    
    // Add and select a mission
    store.dispatch(addMission(sampleMission));
    store.dispatch(selectMission(sampleMission.id));
    
    // Verify mission is selected
    expect(store.getState().mission.selectedMissionId).toBe(sampleMission.id);
    
    // Verify selectedMissionId is cleared
    expect(store.getState().mission.selectedMissionId).toBeNull();
  });
}); 