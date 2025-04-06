import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";
import { ViewerProvider } from './features/map/context/ViewerProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <>
    <ViewerProvider>
    <App />
    </ViewerProvider>
  </>,
)
