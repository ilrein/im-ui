import React, {
  useState,
  useEffect,
} from 'react';
import fetch from 'isomorphic-fetch';
import { Statistic } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { API_URL } from '../../constants';

const TotalShopifyProducts = ({ token, shop, stashProductCount }) => {
  const [count, setCount] = useState(0);

  const getProductsCount = async (token, shop) => {
    try {
      const get = await fetch(`${API_URL}/api/shopify/products/count.json`, {
        headers: {
          token,
          shop,
        },
      })
  
      const result = await get.json();
  
      setCount(result.count);
      stashProductCount(result.count);
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    getProductsCount(token, shop);
  }, []); // eslint-disable-line

  return (
    <Statistic
      label="Total Shopify Products"
      value={count}
    />
  )
};

export default connect(
  null,
  dispatch => ({
    stashProductCount: payload => dispatch({
      type: 'STASH_PRODUCTS_COUNT_SHOPIFY',
      payload,
    })
  })
)(TotalShopifyProducts);
