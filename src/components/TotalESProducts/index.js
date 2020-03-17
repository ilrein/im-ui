import React, {
  useEffect,
} from 'react';
import fetch from 'isomorphic-fetch';
import { Statistic } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { API_URL } from '../../constants';

const TotalESProducts = ({ token, shop, es, stashProductCount }) => {
  const getProductsCount = async (token, shop) => {
    try {
      const get = await fetch(`${API_URL}/api/es/products/count`, {
        headers: {
          token,
          shop,
        },
      })
  
      const result = await get.json();
  
      stashProductCount(result.count);
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    getProductsCount(token, shop);
  }, [token, shop]); // eslint-disable-line

  return (
    <Statistic
      label="Total Synced Products"
      value={es.products.count}
    />
  )
};

export default connect(
  ({ es }) => ({ es }),
  dispatch => ({
    stashProductCount: payload => dispatch({
      type: 'STASH_PRODUCTS_COUNT_ES',
      payload,
    })
  }),
)(TotalESProducts);
