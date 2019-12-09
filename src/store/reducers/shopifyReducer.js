function shopifyReducer(state = {
  products: {
    count: 0,
  }
}, action) {
  switch (action.type) {
    case 'STASH_PRODUCTS_COUNT_SHOPIFY':
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

export default shopifyReducer;
