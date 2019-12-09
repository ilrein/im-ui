import React, {
  useEffect,
} from 'react';
import fetch from 'isomorphic-fetch';
import { Statistic } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { API_URL } from '../../constants';

const TotalShopifyProducts = ({
  token,
  shop,
  stashProductCount,
  shopify,
}) => {
  const getProductsCount = async (token, shop) => {
    try {
      const get = await fetch(`${API_URL}/api/shopify/count`, {
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
  }, []); // eslint-disable-line

  return (
    <Statistic
      label="Total Shopify Products"
      value={shopify.products.count}
    />
  )
};

export default connect(
  ({ shopify }) => ({ shopify }),
  dispatch => ({
    stashProductCount: payload => dispatch({
      type: 'STASH_PRODUCTS_COUNT_SHOPIFY',
      payload,
    })
  })
)(TotalShopifyProducts);
