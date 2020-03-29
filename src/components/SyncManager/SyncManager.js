import React, {
  useState,
  useEffect,
} from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Segment,
  Checkbox,
} from 'semantic-ui-react';
import replace from 'ramda/src/replace';
import { toast } from 'react-toastify';

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
  const [enablingWebhooks, setEnablingWebhooks] = useState(false);
  const [webhooksEnabled, setWebhooksEnabled] = useState(false);

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
    //
    // time to rewrite this to be a purely backend function
    //
    // it should:
    // 1. Send the request to begin operation
    // 2. the backend should perform updates in increments of 250
    // 3. the ui should update every 250 products as well
    // 4. searching may be disabled during this time
    // 5. running sync if the products are at an equal count should do nothing
    // 6. running sync when some products are imported should cleverly only sync non-imported ones
    //

    console.log('initiating sync...', shopify.products.count);

    try {
      setSyncing(true);

      await fetch(`${API_URL}/api/es/products/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          shop,
          token,
        },
        body: JSON.stringify({
          count: shopify.products.count,
        }),
      });
    } catch (error) {
      console.log(error);
    }

    setSyncing(false);
    
    // setSyncing(true);

    // let totalCount = 0;

    // const limit = 250;
    // const totalPages = shopify.products.count / limit;

    // let newUrl = null;
    // for (let index = 0; index < totalPages; index++) {
    //   const page = await getProductsFromShopify(newUrl);

    //   const extendedPageOfProducts = await Promise.all(page.data.products.map(async (product) => {
    //     const metafields = await getMetafieldsByProductId(product.id)

    //     return {
    //       ...product,
    //       ...metafields,
    //     };
    //   }))

    //   totalCount += extendedPageOfProducts.length;

    //   if (page.meta) {
    //     const [previous, next] = page.meta.split(',');

    //     if (next) {
    //       newUrl = replace('<', '', next);
    //       newUrl = replace('>', '', newUrl);
    //     } else {
    //       newUrl = replace('<', '', previous);
    //       newUrl = replace('>', '', newUrl);
    //     }
    //   }

    //   // lets do a bulk insert with this new data
    //   await copyData(extendedPageOfProducts);
    // }

    // setSyncing(false);
    // stashProductCount(totalCount);
    // toast.success('Synced all products!');
  }
  
  const enableWebhooks = async (checked) => {
    setEnablingWebhooks(true);

    if (checked) {
      try {
        const post = await fetch(`${API_URL}/api/shopify/webhooks/enable`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            shop,
            token,
          },
          body: JSON.stringify({
            namespaces: ['global'],
          }),
        });
  
        await post.json();
  
        toast.success('Enabled webhooks!');
        setWebhooksEnabled(true);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const remove = await fetch(`${API_URL}/api/shopify/webhooks/disable`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            shop,
            token,
          },
        })
  
        await remove.json();
  
        toast.warning('Disabled webhooks');
        setWebhooksEnabled(false);
      } catch (error) {
        console.log(error);
      }
    }
    
    setEnablingWebhooks(false);
  }

  const checkIfHooksAreEnabledAlready = async () => {
    setEnablingWebhooks(true);

    try {
      const get = await fetch(`${API_URL}/api/shopify/webhooks`, {
        headers: {
          'Content-Type': 'application/json',
          shop,
          token,
        },
      })

      const result = await get.json();

      if (result && result.webhooks && result.webhooks.length === 3) {
        setWebhooksEnabled(true);
      }
    } catch (error) {
      console.log(error);
    }
    
    setEnablingWebhooks(false);
  }

  useEffect(() => {
    checkIfHooksAreEnabledAlready();
  }, [session]); // eslint-disable-line

  return (
    <Segment
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
      loading={enablingWebhooks}
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
        label="Webhooks Enabled"
        onChange={(event, { checked }) => enableWebhooks(checked)}
        checked={webhooksEnabled}
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

