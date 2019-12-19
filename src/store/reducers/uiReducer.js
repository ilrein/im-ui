function uiReducer(state = {
  visibleProperties: [
    'id',
    'title',
    'body_html',
    'vendor',
    'product_type',
    'created_at',
    'handle',
    'updated_at',
    'published_at',
    'tags',
  ],
}, action) {
  switch (action.type) {
    case 'CHANGE_VISIBLE_PROPERTIES':
      return {
        visibleProperties: action.payload,
      };
    default:
      return state;
  }
}

export default uiReducer;
