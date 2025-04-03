import { Navbar, Alignment, Button } from '@blueprintjs/core'
import { useDispatch } from 'react-redux'
import { setDrawingMode } from '../../store/missionSlice'

const Header = () => {
  const dispatch = useDispatch()

  const handleNewMission = () => {
    dispatch(setDrawingMode(true))
  }

  return (
    <Navbar >
      <Navbar.Group align={Alignment.LEFT}>
        <Navbar.Heading>Field Ops Dashboard</Navbar.Heading>
      </Navbar.Group>
      <Navbar.Group align={Alignment.RIGHT}>
        <Button
          intent="primary"
          icon="add"
          text="Yeni Görev"
          onClick={handleNewMission}
        />
      </Navbar.Group>
    </Navbar>
  )
}

export default Header
