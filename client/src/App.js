
import './App.css';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import Dashboard from './components/Dashboard';
import SearchByIng from './components/SearchByIng';

function App() {
  return (
    <div className="App">
      
      <Router >

        <Route path={""} exact component={Dashboard}/>
        <Switch>
          <Route path={"/search"} exact component={SearchByIng}/>
        </Switch>
        
      </Router>

    </div>
  );
}

export default App;