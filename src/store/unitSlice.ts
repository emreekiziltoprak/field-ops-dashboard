import  { createSlice } from '@reduxjs/toolkit';


type Unit = {
    id: string
    name: string
    speed: number
    course: number
    type: string
  }
  
  type UnitState = {
    selectedUnits: Unit[]
  }
  
  const initialState: UnitState = {
    selectedUnits: [],
  }
  
  const unitSlice = createSlice({
    name: 'unit',
    initialState,
    reducers: {
      addUnitToPanel: (state, action) => {
        state.selectedUnits = [action.payload];
      },
      removeUnitFromPanel: (state, action) => {
        state.selectedUnits = state.selectedUnits.filter(u => u.id !== action.payload)
      },
    },
  })
  
  export const { addUnitToPanel, removeUnitFromPanel } = unitSlice.actions
  export default unitSlice.reducer
  