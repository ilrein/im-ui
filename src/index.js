import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import configureStore from './store';
import './index.css';
import 'semantic-ui-css/semantic.min.css'
import Routes from './routes';
import * as serviceWorker from './serviceWorker';

const store = configureStore();

const renderApp = () => render(
  <Provider store={store}>
    <Routes />
  </Provider>,
  document.getElementById('root'),
);

if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept('./routes', renderApp);
}

console.log('process.env.NODE_ENV', process.env.NODE_ENV);

renderApp();
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
