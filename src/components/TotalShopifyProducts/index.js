import React, {
  useEffect,
} from 'react';
import fetch from 'isomorphic-fetch';
import { Statistic } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { API_URL } from '../../constants';

const TotalShopifyProducts = ({
  session,
  stashProductCount,
  shopify,
}) => {
  const { token, shop } = session;

  const getProductsCount = async (token, shop) => {
    try {
      const get = await fetch(`${API_URL}/api/shopify/products/count`, {
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
  }, [session]); // eslint-disable-line

  return (
    <Statistic
      label="Total Shopify Products"
      value={shopify.products.count}
      style={{ margin: 0 }}
    />
  )
};

export default connect(
  ({ shopify, session }) => ({ shopify, session }),
  dispatch => ({
    stashProductCount: payload => dispatch({
      type: 'STASH_PRODUCTS_COUNT_SHOPIFY',
      payload,
    })
  })
)(TotalShopifyProducts);
