import './App.css';
import Routing from './copmonents/Routing/routing';
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter basename={window.location.pathname || ''}>
    <div className="App">
      <Routing/>
    </div>
    </BrowserRouter>
  );
}

export default App;
