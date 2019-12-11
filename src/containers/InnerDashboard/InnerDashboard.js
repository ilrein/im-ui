import React, { useState } from 'react';
import {
  Container,
  Button,
  Segment,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import replace from 'ramda/src/replace';
import isNil from 'ramda/src/isNil';
// import fetch from 'isomorphic-fetch';

import { API_URL } from '../../constants';
import TotalShopifyProducts from '../../components/TotalShopifyProducts';
import TotalESProducts from '../../components/TotalESProducts';

const InnerDashboard = ({ shopify, shop, token }) => {
  const [syncing, setSyncing] = useState(false);
  // const [data, setData] = useState([]);

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

  const handleSync = async () => {
    setSyncing(true);

    const totalPages = shopify.products.count / 2;

    // console.log(shopify.products.count, totalPages);

    let allTheData = [];
    let newUrl = null;
    // loop through each of the pages
    for (let index = 0; index < totalPages; index++) {
      console.log('looping', index);

      const page = await getProductsFromShopify(newUrl);

      if (page.meta) {
        newUrl = replace('<', '', page.meta);
        newUrl = replace('>', '', newUrl);
      }

      // console.log(page);
      allTheData.push(...page.data.products);
    }

    setSyncing(false);
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
