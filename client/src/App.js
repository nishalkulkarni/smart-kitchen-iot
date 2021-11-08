import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Dashboard from "./components/Dashboard";

function App() {
  return (
    <div className="App">
      <Router>
        <Route path={""} exact component={Dashboard} />
      </Router>
    </div>
  );
}

export default App;
