import { Provider } from 'react-redux'
import AppLayout from './layouts/AppLayout'
import Header from './components/header/Header'
import store from './store'

const App = () => {


  return (
    <Provider store={store}>
      <div className="bp5-dark" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <div style={{ flex: 1 }}>
          <AppLayout />
        </div>
      </div>
    </Provider>
  )
}

export default App