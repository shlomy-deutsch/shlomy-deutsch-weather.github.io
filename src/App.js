import './App.css';
import Routing from './copmonents/Routing/routing';
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Routing/>
    </div>
    </BrowserRouter>
  );
}

export default App;
