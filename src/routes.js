import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Shopify from './pages/Shopify';

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
    </Switch>
    <ToastContainer />
  </Router>
)

export default Routes;
