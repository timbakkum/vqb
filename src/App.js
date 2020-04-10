import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import VQB from "./features/vqb/vqb";
import VQBv2 from "./features/vqb-v2/vqb-v2";
import "./App.css";

function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/v1">PoC v1</Link>
          </li>
          <li>
            <Link to="/v2">PoC v2</Link>
          </li>
        </ul>
      </nav>
      <Switch>
        <Route path="/v1">
          <VQB />
        </Route>
        <Route path="/v2">
          <VQBv2 />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
