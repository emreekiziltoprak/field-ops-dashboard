import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";
import { ViewerProvider } from './features/map/context/ViewerProvider.tsx';
import { PositionCalculator } from './service/unitSimulation/PositionCalculator.ts';
import { UnitSimulationService } from './service/unitSimulation/UnitSimulationService.ts';
import { setUnits } from './store/simulationSlice.ts';
import store from './store/index.ts';
import { initialUnits } from './mock/unitMock.ts';


const positionCalculator = new PositionCalculator();
export const simulationService = new UnitSimulationService(initialUnits, 5000, positionCalculator);

simulationService.start((units) => {
  store.dispatch(setUnits(units));
});


createRoot(document.getElementById('root')!).render(
  <>
    <ViewerProvider>
    <App />
    </ViewerProvider>
  </>,
)
