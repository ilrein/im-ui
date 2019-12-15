import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Shopify from './pages/Shopify';
import Product from './pages/Product';

const Routes = () => (
  <Router>
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/shopify">
        <Shopify />
      </Route>
      <Route path="/dashboard">
        <Dashboard />
      </Route>
      <Route path="/product/:id">
        <Product />
      </Route>
    </Switch>
  </Router>
)

export default Routes;
