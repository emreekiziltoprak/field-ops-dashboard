import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import DutyCard from '../../components/dutyCard/DutyCard'
import { HTMLSelect, InputGroup } from '@blueprintjs/core'
import { useState } from 'react'
import { selectMission } from '../../store/missionSlice'

const UnitInfoPanel = () => {
  const dispatch = useDispatch()
  const { selectedMissionId, missions } = useSelector((state: RootState) => state.mission)
  const mission = missions.find((m) => m.id === selectedMissionId)

  const [filterType, setFilterType] = useState<string>('Hepsi')
  const [filterDate, setFilterDate] = useState<string>('')

  const filteredMissions = missions.filter((m) => {
    const matchesType = filterType === 'Hepsi' || m.type === filterType
    const matchesDate =
      !filterDate ||
      (new Date(m.startTime) <= new Date(filterDate) &&
        new Date(m.endTime) >= new Date(filterDate))

    return matchesType && matchesDate && m.id !== selectedMissionId // Seçili olanı en alta listeleme
  });


  return (
    <div style={{ padding: '8px', color: 'white' }}>
      {/* Seçili Görev */}
      {mission && (
        <>
          <p style={{ marginBottom: 6, fontWeight: 'bold' }}>🔹 Seçili Görev</p>
          <DutyCard mission={mission} />
        </>
      )}

      {/* Filtre */}
      <div style={{ display: 'flex', gap: 8, margin: '16px 0' }}>
        <HTMLSelect
          options={['Hepsi', 'Gözetleme', 'Müdahale', 'İstihbarat']}
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          fill
        />
        <InputGroup
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          fill
        />
      </div>

      {/* Diğer Görevler */}
      {filteredMissions.length > 0 && (
        <>
          <p style={{ marginBottom: 6, fontWeight: 'bold' }}>📋 Diğer Görevler</p>
          {filteredMissions.map((m) => (
            <div key={m.id} onClick={() => dispatch(selectMission(m.id))} style={{ cursor: 'pointer' }}>
              <DutyCard mission={m} />
            </div>
          ))}
        </>
      )}

      {filteredMissions.length === 0 && <p>Uygun görev bulunamadı.</p>}
    </div>
  )
}

export default UnitInfoPanel
