function sessionReducer(state = {}, action) {
  switch (action.type) {
    case 'STASH_TOKEN':
      return {
        ...state,
        token: action.payload,
      };
    case 'STASH_SHOP':
      return {
        ...state,
        shop: action.payload,
      };
    default:
      return state;
  }
}

export default sessionReducer;
