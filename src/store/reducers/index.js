import {
  combineReducers,
} from 'redux';

import shopifyReducer from './shopifyReducer';
import esReducer from './esReducer';
import sessionReducer from './sessionReducer';
import productReducer from './productReducer';

const rootReducer = combineReducers({
  session: sessionReducer,
  es: esReducer,
  shopify: shopifyReducer,
  product: productReducer,
});

export default rootReducer;
