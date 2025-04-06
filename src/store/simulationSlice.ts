// src/store/simulationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Unit } from '../types/Unit';

interface SimulationState {
  units: Unit[];
  refreshInterval: number;
}

const initialState: SimulationState = {
  units: [],
  refreshInterval: 3000 // Default refresh interval in milliseconds
};

const simulationSlice = createSlice({
  name: 'simulation',
  initialState,
  reducers: {
    setUnits(state, action: PayloadAction<Unit[]>) {
      state.units = action.payload;
    },
    setRefreshInterval(state, action: PayloadAction<number>) {
      state.refreshInterval = action.payload;
    }
  }
});

export const { setUnits, setRefreshInterval } = simulationSlice.actions;
export default simulationSlice.reducer;
