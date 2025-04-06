import { Mission } from './../features/mission/renderer/IMissionRenderer';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Coordinate } from '../features/mission/hooks/useZoomMission'
import { act } from 'react';

export type Mission = {
  id: string
  name: string
  type: string
  startTime: string
  endTime: string
  coordinates: Coordinate[]
}

type MissionState = {
  missions: Mission[]
  drawingMode: boolean
  selectedMissionId: string | null,
  selectedMission: Mission | null
}

const initialState: MissionState = {
  missions: [],
  drawingMode: false,
  selectedMissionId: null,
  selectedMission: null
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
    selectMissionObj : (state, action: PayloadAction<Mission>) => {
      state.selectedMission = action.payload
    }
  },
})

export const { setDrawingMode, addMission, selectMission, selectMissionObj} = missionSlice.actions
export default missionSlice.reducer
