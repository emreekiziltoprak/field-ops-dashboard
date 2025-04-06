import {
  Dialog,
  FormGroup,
  InputGroup,
  HTMLSelect,
  Button
} from '@blueprintjs/core'
import { Formik, Form  } from 'formik'
import * as Yup from 'yup'

type Props = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    name: string
    type: string
    startTime: string
    endTime: string
  }) => void
}

const missionSchema = Yup.object().shape({
  name: Yup.string().required('Görev adı zorunludur'),
  type: Yup.string().required('Görev tipi zorunludur'),
  startTime: Yup.string().required('Başlangıç zamanı zorunludur'),
  endTime: Yup.string().required('Bitiş zamanı zorunludur')
})

const MissionFormModal = ({ isOpen, onClose, onSubmit }: Props) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Yeni Görev">
      <div className="bp5-dialog-body">
        <Formik
          initialValues={{
            name: '',
            type: 'Gözetleme',
            startTime: '',
            endTime: ''
          }}
          validationSchema={missionSchema}
          onSubmit={(values) => {
            onSubmit(values)
            onClose()
          }}
        >
          {({ values, handleChange, handleBlur, errors, touched }) => (
            <Form>
              <FormGroup
                label="Görev Adı"
                intent={touched.name && errors.name ? 'danger' : 'none'}
                helperText={touched.name && errors.name}
              >
                <InputGroup
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </FormGroup>

              <FormGroup
                label="Görev Tipi"
                intent={touched.type && errors.type ? 'danger' : 'none'}
                helperText={touched.type && errors.type}
              >
                <HTMLSelect
                  name="type"
                  options={['Gözetleme', 'İstihbarat', 'Müdahale']}
                  value={values.type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </FormGroup>

              <FormGroup
                label="Başlangıç Zamanı"
                intent={
                  touched.startTime && errors.startTime ? 'danger' : 'none'
                }
                helperText={touched.startTime && errors.startTime}
              >
                <InputGroup
                  name="startTime"
                  type="datetime-local"
                  value={values.startTime}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </FormGroup>

              <FormGroup
                label="Bitiş Zamanı"
                intent={touched.endTime && errors.endTime ? 'danger' : 'none'}
                helperText={touched.endTime && errors.endTime}
              >
                <InputGroup
                  name="endTime"
                  type="datetime-local"
                  value={values.endTime}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </FormGroup>

              <Button intent="primary" type="submit">
                Kaydet
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </Dialog>
  )
}

export default MissionFormModal
