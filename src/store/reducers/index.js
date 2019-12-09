import {
  combineReducers,
} from 'redux';

import shopifyReducer from './shopifyReducer';
import sessionReducer from './sessionReducer';

const rootReducer = combineReducers({
  shopify: shopifyReducer,
  session: sessionReducer,
});

export default rootReducer;
