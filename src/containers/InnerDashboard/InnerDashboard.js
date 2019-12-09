import React, { useState } from 'react';
import {
  Container,
  Button,
  Segment,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
// import fetch from 'isomorphic-fetch';

import TotalShopifyProducts from '../../components/TotalShopifyProducts';
import TotalESProducts from '../../components/TotalESProducts';

const InnerDashboard = ({ shopify, shop, token }) => {
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);

    // 1. get total products in shopify db - check
    console.log(shopify);
    // 2. get products by page
    // 3. for each page, post all products to ES
    // 4. notify on success

    // const totalPages = await fetch()

    setTimeout(() => {
      setSyncing(false);
    }, 2000);
  }

  return (
    <Container
      style={{ marginTop: '1rem' }}
    >
      <Segment
        style={{ display: 'flex', justifyContent: 'space-between' }}
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
      </Segment>
    </Container>
  )
}

export default connect(
  ({ shopify }) => ({ shopify }),
)(InnerDashboard);
