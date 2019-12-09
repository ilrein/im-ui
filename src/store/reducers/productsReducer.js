function productsReducer(state = {}, action) {
  switch (action.type) {
    case 'SYNC':
      return action.payload;
    default:
      return state;
  }
}

export default productsReducer;
