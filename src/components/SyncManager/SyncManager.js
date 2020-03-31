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
import { toast } from 'react-toastify';

import { API_URL } from '../../constants';
import TotalShopifyProducts from '../../components/TotalShopifyProducts';
import TotalESProducts from '../../components/TotalESProducts';

const SyncManager = ({
  shopify,
  es,
  session,
}) => {
  const { token, shop } = session;

  const { count: totalESProducts } = es.products;
  const { count: totalShopifyProducts } = shopify.products;

  const [syncing, setSyncing] = useState(false);
  const [enablingWebhooks, setEnablingWebhooks] = useState(false);
  const [webhooksEnabled, setWebhooksEnabled] = useState(false);
  
  const handleSync = async () => {
    //
    // You rock!
    //
    // This function:
    // 1. Send the request to begin operation
    // 2. the backend should perform updates in increments of 250
    // 3. the ui should update every 250 products as well
    // 4. searching may be disabled during this time
    // 5. running sync if the products are at an equal count should do nothing
    // 6. running sync when some products are imported should cleverly only sync non-imported ones
    //

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
        disabled={totalESProducts === totalShopifyProducts}
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
  ({ shopify, es, session }) => ({ shopify, es, session }),
)(SyncManager);

