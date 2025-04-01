import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type Mission = {
  id: string
  name: string
  type: string
  startTime: string
  endTime: string
  coordinates: { lat: number; lng: number }[]
}

type MissionState = {
  missions: Mission[]
  drawingMode: boolean
  selectedMissionId: string | null
}

const initialState: MissionState = {
  missions: [],
  drawingMode: false,
  selectedMissionId: null,
}

const missionSlice = createSlice({
  name: 'mission',
  initialState,
  reducers: {
    setDrawingMode: (state, action: PayloadAction<boolean>) => {
      state.drawingMode = action.payload
    },
    addMission: (state, action: PayloadAction<Mission>) => {
      state.missions.push(action.payload)
    },
    selectMission: (state, action: PayloadAction<string>) => {
      state.selectedMissionId = action.payload
    },
  },
})

export const { setDrawingMode, addMission, selectMission } = missionSlice.actions
export default missionSlice.reducer
