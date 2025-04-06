import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import DutyCard from '../../components/dutyCard/DutyCard'
import { HTMLSelect, InputGroup, Button, Collapse, Card } from '@blueprintjs/core'
import { useState } from 'react'
import { selectMission } from '../../store/missionSlice'
import SimpleUnitChart from './UnitGraphCard'

const UnitInfoPanel = () => {
  const dispatch = useDispatch()
  const { selectedMissionId, missions } = useSelector((state: RootState) => state.mission)
  const { selectedUnits } = useSelector((state: RootState) => state.unit)

  const mission = missions.find((m) => m.id === selectedMissionId)

  const [filterType, setFilterType] = useState<string>('Hepsi')
  const [filterDate, setFilterDate] = useState<string>('')

  const [isChartOpen, setIsChartOpen] = useState(true)
  const [isMissionsOpen, setIsMissionsOpen] = useState(true)

  const filteredMissions = missions.filter((m) => {
    const matchesType = filterType === 'Hepsi' || m.type === filterType
    const matchesDate =
      !filterDate ||
      (new Date(m.startTime) <= new Date(filterDate) &&
        new Date(m.endTime) >= new Date(filterDate))

    return matchesType && matchesDate && m.id !== selectedMissionId
  })

  return (
    <div style={{ padding: '8px', color: 'white', overflow: "auto", height: "100%" }}>
      {/* Unit Chart Accordion */}
      <Card style={{ marginBottom: 8, }}>
        <Button
          fill
          minimal
          onClick={() => setIsChartOpen(!isChartOpen)}
          rightIcon={isChartOpen ? 'chevron-up' : 'chevron-down'}
          style={{ justifyContent: 'space-between', color: 'white' }}
        >
          📊 Birim Hareket Grafiği
        </Button>
        <Collapse isOpen={isChartOpen}>
          {selectedUnits && selectedUnits.length !== 0 ? <SimpleUnitChart /> : <p>Seçili birim yok.</p>}
        </Collapse>
      </Card>

      {/* Missions Accordion */}
      <Card >
        <Button
          fill
          minimal
          onClick={() => setIsMissionsOpen(!isMissionsOpen)}
          rightIcon={isMissionsOpen ? 'chevron-up' : 'chevron-down'}
          style={{ justifyContent: 'space-between', color: 'white' }}
        >
          📋 Görevler
        </Button>
        <Collapse isOpen={isMissionsOpen}>
          <div style={{ paddingTop: 12 }}>
            {/* Selected Mission */}
            {mission && (
              <>
                <p style={{ marginBottom: 6, fontWeight: 'bold' }}>🔹 Seçili Görev</p>
                <DutyCard mission={mission} />
              </>
            )}

            {/* Filter */}
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

            {/* Other Missions */}
            {filteredMissions.length > 0 ? (
              <>
                <p style={{ marginBottom: 6, fontWeight: 'bold' }}>📋 Diğer Görevler</p>
                {filteredMissions.map((m) => (
                  <div key={m.id} onClick={() => dispatch(selectMission(m.id))} style={{ cursor: 'pointer' }}>
                    <DutyCard mission={m} />
                  </div>
                ))}
              </>
            ) : (
              <p>Uygun görev bulunamadı.</p>
            )}
          </div>
        </Collapse>
      </Card>
    </div>
  )
}

export default UnitInfoPanel
