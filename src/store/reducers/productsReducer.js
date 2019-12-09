function productsReducer(state = {
  shopify: {
    products: {
      count: 0,
    }
  }
}, action) {
  switch (action.type) {
    case 'STASH_PRODUCTS_COUNT_SHOPIFY':
      return {
        shopify: {
          products: {
            ...state.shopify.products,
            count: action.payload,
          }
        }
      };
    default:
      return state;
  }
}

export default productsReducer;
