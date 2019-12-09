import {
  combineReducers,
} from 'redux';

import productsReducer from './productsReducer';
import sessionReducer from './sessionReducer';

const rootReducer = combineReducers({
  products: productsReducer,
  session: sessionReducer,
});

export default rootReducer;
