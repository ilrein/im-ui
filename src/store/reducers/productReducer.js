function productReducer(state = {}, action) {
  switch (action.type) {
    case 'STASH_PRODUCT':
      return action.payload;
    default:
      return state;
  }
}

export default productReducer;
