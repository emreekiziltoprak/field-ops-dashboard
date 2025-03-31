import "./App.css";
import "react-mosaic-component/react-mosaic-component.css";
import AppLayout from "./layouts/AppLayout";
import { Provider } from "react-redux";
import store from "./store";

function App() {
  return (
    <Provider store={store}>
      <AppLayout />
    </Provider>
  );
}

export default App;
