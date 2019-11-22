import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Dashboard from './pages/Dashboard';
import Home from './pages/Home';

const Routes = () => (
  <Router>
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/dashboard">
        <Dashboard />
      </Route>
    </Switch>
  </Router>
)

export default Routes;
