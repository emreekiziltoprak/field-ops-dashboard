import { Provider } from 'react-redux'
import AppLayout from './layouts/AppLayout'
import Header from './components/header/Header'
import store from './store'
import { BottomBar } from './layouts/bottomBar/BottomBar'
import "./App.scss"

const App = () => {
  return (
    <Provider store={store}>
      <div className="bp5-dark" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <Header />
          <AppLayout />
          <BottomBar />
        </div>
      </div>
    </Provider>
  )
}

export default App