const defaultProperties = [
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
  },
  {
    key: 'metafields',
    visible: true,
  }
];

function uiReducer(state = {
  properties: localStorage.getItem('im-visible-props-config') === null ? defaultProperties : JSON.parse(localStorage.getItem('im-visible-props-config')).properties,
}, action) {
  switch (action.type) {
    case 'CHANGE_PROP_VISIBILITY':
      const itemToChange = state.properties.find(prop => prop.key === action.key);
      itemToChange.visible = action.payload;

      const newState = {
        properties: [
          ...state.properties,
        ]
      };

      localStorage.setItem('im-visible-props-config', JSON.stringify(newState));

      return newState;
    default:
      return state;
  }
}

export default uiReducer;
