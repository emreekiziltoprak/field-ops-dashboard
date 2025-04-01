import { Card, Button, H4, Icon, Text } from '@blueprintjs/core'
import './style.scss'

type Props = {
  unit: {
    id: string
    name: string
    speed: number
    course: number
    type: string
  }
  onClose: () => void
}

const UnitCard = ({ unit, onClose }: Props) => {
  return (
    <Card className="unit-card bp5-dark" elevation={2}>
      <div className="unit-card__header">
        <H4 className="unit-card__title">
          <Icon icon="airplane" className="unit-card__icon" />
          {unit.name}
        </H4>
        <Button minimal icon="cross" onClick={onClose} className="unit-card__close" />
      </div>

      <div className="unit-card__content">
        <Text>🛡️ Type: <strong>{unit.type}</strong></Text>
        <Text>🚀 Speed: <strong>{unit.speed} km/s</strong></Text>
        <Text>🧭 Direction: <strong>{unit.course}°</strong></Text>
      </div>
    </Card>
  )
}

export default UnitCard
