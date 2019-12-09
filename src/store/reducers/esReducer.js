function esReducer(state = {
  products: {
    count: 0,
  }
}, action) {
  switch (action.type) {
    case 'STASH_PRODUCTS_COUNT_ES':
      return {
        products: {
          ...state.products,
          count: action.payload,
        }
      };
    default:
      return state;
  }
}

export default esReducer;
