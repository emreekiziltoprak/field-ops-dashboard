import { Card, H4, Text } from '@blueprintjs/core'
import { useDispatch } from 'react-redux'
import { selectMission } from '../../store/missionSlice'
import { useZoomToMission } from '../../features/mission/hooks/useZoomMission'

type Props = {
  mission: {
    id: string
    name: string
    type: string
    startTime: string
    endTime: string
    coordinates: { lat: number; lng: number }[]
  }
}

const DutyCard = ({ mission }: Props) => {
  const dispatch = useDispatch()
  const zoomToMission = useZoomToMission() 

  const handleClick = () => {
    dispatch(selectMission(mission.id))
    zoomToMission(mission.coordinates) 
  }

  return (
    <Card interactive onClick={handleClick}>
      <H4>{mission.name}</H4>
      <Text>Tip: {mission.type}</Text>
      <Text>Başlangıç: {new Date(mission.startTime).toLocaleString()}</Text>
      <Text>Bitiş: {new Date(mission.endTime).toLocaleString()}</Text>
      <Text>Koordinat: {mission.coordinates.length}</Text>
    </Card>
  )
}

export default DutyCard
