function sessionReducer(state = {
  token: '',
  shop: '',
}, action) {
  switch (action.type) {
    case 'STASH_SESSION_DATA':
      return action.payload;
    default:
      return state;
  }
}

export default sessionReducer;
