import { useSelector, useDispatch } from 'react-redux'
import UnitCard from '../../components/unitCard/UnitCard'
import { removeUnitFromPanel } from '../../store/unitSlice'
import { RootState } from '../../store'

const UnitInfoPanel = () => {
  const dispatch = useDispatch()
  const units = useSelector((state: RootState) => state.unit.selectedUnits)

  return (
    <div style={{ height: '100%', width: "100%", overflowY: 'auto', padding: 12, background: '#202830' }}>
      {units.map((unit) => (
        <UnitCard
          key={unit.id}
          unit={unit}
          onClose={() => dispatch(removeUnitFromPanel(unit.id))}
        />
      ))}
    </div>
  )
}

export default UnitInfoPanel
