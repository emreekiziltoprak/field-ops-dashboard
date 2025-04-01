import { Card, H4, Text } from '@blueprintjs/core'
import { useDispatch } from 'react-redux'
import { selectMission } from '../../store/missionSlice'

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

  return (
    <Card interactive onClick={() => dispatch(selectMission(mission.id))}>
      <H4>{mission.name}</H4>
      <Text>Tip: {mission.type}</Text>
      <Text>Başlangıç: {new Date(mission.startTime).toLocaleString()}</Text>
      <Text>Bitiş: {new Date(mission.endTime).toLocaleString()}</Text>
      <Text>Koordinat: {mission.coordinates.length}</Text>
    </Card>
  )
}

export default DutyCard
