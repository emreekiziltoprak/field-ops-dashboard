import { Provider } from 'react-redux'
import AppLayout from './layouts/AppLayout'
import Header from './components/header/Header'
import store from './store'
import { BottomBar } from './layouts/bottomBar/BottomBar'

const App = () => {
  const handleIntervalChange = (interval: number) => {
    console.log("Interval değişti:", interval);
  };

  return (
    <Provider store={store}>
      
      <div className="bp5-dark" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>

        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <Header />
          <AppLayout />
          <BottomBar onIntervalChange={handleIntervalChange} />
        </div>

      </div>
      
    </Provider>
  )
}

export default App