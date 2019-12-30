import React, {
  useState,
} from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Segment,
  Checkbox,
} from 'semantic-ui-react';
import replace from 'ramda/src/replace';

import { API_URL } from '../../constants';
import TotalShopifyProducts from '../../components/TotalShopifyProducts';
import TotalESProducts from '../../components/TotalESProducts';

const SyncManager = ({
  shopify,
  stashProductCount,
  session,
}) => {
  const { token, shop } = session;
  const [syncing, setSyncing] = useState(false);

  const getProductsFromShopify = async (page = null) => {
    try {
      const get = await fetch(`${API_URL}/api/shopify/products`, {
        headers: {
          shop,
          token,
          ...(page) && { page },
        },
      });

      const result = await get.json();

      return result;
    } catch (error) {
      console.log(error);
    }
  }

  const getMetafieldsByProductId = async (productId) => {
    try {
      const get = await fetch(`${API_URL}/api/shopify/products/${productId}/metafields`, {
        headers: {
          shop,
          token,
        },
      });

      const result = await get.json();

      return result;
    } catch (error) {
      console.log(error);
    }
  }

  const copyData = async (data) => {
    try {
      const post = await fetch(`${API_URL}/api/es/products/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          shop,
        },
        body: JSON.stringify(data),
      });

      const result = await post.json();

      return result;
    } catch (error) {
      console.log(error);
    }
  };
  
  const handleSync = async () => {
    setSyncing(true);

    let totalCount = 0;

    const limit = 250;
    const totalPages = shopify.products.count / limit;

    let newUrl = null;
    for (let index = 0; index < totalPages; index++) {
      const page = await getProductsFromShopify(newUrl);

      const extendedPageOfProducts = await Promise.all(page.data.products.map(async (product) => {
        const metafields = await getMetafieldsByProductId(product.id)

        return {
          ...product,
          ...metafields,
        };
      }))

      totalCount += extendedPageOfProducts.length;

      if (page.meta) {
        newUrl = replace('<', '', page.meta);
        newUrl = replace('>', '', newUrl);
      }

      // lets do a bulk insert with this new data
      await copyData(extendedPageOfProducts);
    }

    setSyncing(false);
    stashProductCount(totalCount);
  }

  const enableWebhooks = async (checked) => {
    setSyncing(true);

    try {
      console.log('configuring webhooks', checked);
    } catch (error) {
      
    }
    
    setSyncing(false);
  }

  return (
    <Segment
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <TotalShopifyProducts
        token={token}
        shop={shop}
      />

      <TotalESProducts
        token={token}
        shop={shop}
      />

      <Button
        onClick={handleSync}
        loading={syncing}
      >
        Sync Now
      </Button>

      <Checkbox
        slider
        label="Webooks Enabked"
        onChange={(event, { checked }) => enableWebhooks(checked)}
      />
    </Segment>
  )
}

export default connect(
  ({ shopify, ui, session }) => ({ shopify, ui, session }),
  dispatch => ({
    stashProducts: payload => dispatch({
      type: 'STASH_PRODUCTS_ES',
      payload,
    }),
    stashProductCount: payload => dispatch({
      type: 'STASH_PRODUCTS_COUNT_ES',
      payload,
    }),
  }),
)(SyncManager);

