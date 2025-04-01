import { Dialog, FormGroup, InputGroup, HTMLSelect, Button } from '@blueprintjs/core'
import { useState } from 'react'

type Props = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { name: string; type: string; startTime: string; endTime: string }) => void
}

const MissionFormModal = ({ isOpen, onClose, onSubmit }: Props) => {
  const [name, setName] = useState('')
  const [type, setType] = useState('Gözetleme')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')

  const handleSubmit = () => {
    onSubmit({ name, type, startTime, endTime })
    onClose()
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Yeni Görev">
      <div className="bp5-dialog-body">
        <FormGroup label="Görev Adı">
          <InputGroup value={name} onChange={(e) => setName(e.target.value)} />
        </FormGroup>
        <FormGroup label="Görev Tipi">
          <HTMLSelect
            options={['Gözetleme', 'İstihbarat', 'Müdahale']}
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
        </FormGroup>
        <FormGroup label="Başlangıç Zamanı">
          <InputGroup
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </FormGroup>
        <FormGroup label="Bitiş Zamanı">
          <InputGroup
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </FormGroup>
        <Button intent="primary" onClick={handleSubmit}>
          Kaydet
        </Button>
      </div>
    </Dialog>
  )
}

export default MissionFormModal
