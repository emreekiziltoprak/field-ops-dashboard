import { configureStore } from '@reduxjs/toolkit'
import unitReducer from './unitSlice'
import missionReducer from './missionSlice'

const store = configureStore({
  reducer: {
    unit: unitReducer,
    mission: missionReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
