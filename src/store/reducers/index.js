import {
  combineReducers,
} from 'redux';

import shopifyReducer from './shopifyReducer';
import esReducer from './esReducer';
import sessionReducer from './sessionReducer';
import uiReducer from './uiReducer';
// import productReducer from './productReducer';

const rootReducer = combineReducers({
  session: sessionReducer,
  es: esReducer,
  shopify: shopifyReducer,
  ui: uiReducer,
  // product: productReducer,
});

export default rootReducer;
