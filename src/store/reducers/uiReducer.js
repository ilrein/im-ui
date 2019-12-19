function uiReducer(state = {
  properties: [
    {
      key: 'id',
      visible: true,
    },
    {
      key: 'title',
      visible: true,
    },
    {
      key: 'body_html',
      visible: true,
    },
    {
      key: 'vendor',
      visible: true,
    },
    {
      key: 'product_type',
      visible: true,
    },
    {
      key: 'created_at',
      visible: true,
    },
    {
      key: 'handle',
      visible: true,
    },
    {
      key: 'updated_at',
      visible: true,
    },
    {
      key: 'published_at',
      visible: false,
    },
    {
      key: 'tags',
      visible: true,
    }
  ],
}, action) {
  switch (action.type) {
    case 'CHANGE_VISIBLE_PROPERTIES':
      return {
        properties: action.payload,
      };
    default:
      return state;
  }
}

export default uiReducer;
