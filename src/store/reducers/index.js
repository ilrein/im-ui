import {
  combineReducers,
} from 'redux';

import shopifyReducer from './shopifyReducer';
import esReducer from './esReducer';
import sessionReducer from './sessionReducer';

const rootReducer = combineReducers({
  session: sessionReducer,
  es: esReducer,
  shopify: shopifyReducer,
});

export default rootReducer;
