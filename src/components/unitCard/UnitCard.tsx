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
      <div style={{ background: '#2b2f3a', borderRadius: 8, padding: 12, marginBottom: 10, color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h4>{unit.name}</h4>
          <button onClick={onClose} style={{ color: 'white' }}>✖</button>
        </div>
        <p>Type: {unit.type}</p>
        <p>Speed: {unit.speed} km/s</p>
        <p>Direction: {unit.course}°</p>
      </div>
    )
  }

export default UnitCard;