// src/store/simulationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Unit } from '../types/Unit';

interface SimulationState {
  units: Unit[];
}

const initialState: SimulationState = {
  units: [] 
};

const simulationSlice = createSlice({
  name: 'simulation',
  initialState,
  reducers: {
    setUnits(state, action: PayloadAction<Unit[]>) {
      state.units = action.payload;
    }
  }
});

export const { setUnits } = simulationSlice.actions;
export default simulationSlice.reducer;
