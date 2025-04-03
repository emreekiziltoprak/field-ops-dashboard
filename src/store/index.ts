import { configureStore } from '@reduxjs/toolkit'
import unitReducer from './unitSlice'
import missionReducer from './missionSlice'
import simulationReducer from './simulationSlice'

const store = configureStore({
  reducer: {
    unit: unitReducer,
    mission: missionReducer,
    simulation: simulationReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
