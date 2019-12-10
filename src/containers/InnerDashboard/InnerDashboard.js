import React, { useState } from 'react';
import {
  Container,
  Button,
  Segment,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import replace from 'ramda/src/replace';
// import fetch from 'isomorphic-fetch';

import { API_URL } from '../../constants';
import TotalShopifyProducts from '../../components/TotalShopifyProducts';
import TotalESProducts from '../../components/TotalESProducts';

const InnerDashboard = ({ shopify, shop, token }) => {
  const [syncing, setSyncing] = useState(false);

  const getProductsFromShopify = async (page = null) => {
    // console.log('page header', page);
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

    // console.log('applying sync...');

    // 1. get total products in shopify db
    // const { count } = shopify.products;
    
    // 2. get products by page
    // how many pages are there?
    // let totalPagesOfProducts = 1;
    

    // if ((count / 250) < 1) {
    //   console.log('less than 250 products in db');
    // }

    const firstPageOfProductsFromShopify = await getProductsFromShopify();

    console.log(firstPageOfProductsFromShopify);

    if (firstPageOfProductsFromShopify.meta) {
      let newUrl = '';
      newUrl = replace('<', '', firstPageOfProductsFromShopify.meta);
      newUrl = replace('>', '', newUrl);

      // newUrl is now a self-contained link
      // time to issue another request
      // console.log('newUrl', newUrl);
      
      try {
        const nextPageOfData = await getProductsFromShopify(newUrl);

        console.log('nextPageOfData', nextPageOfData);
      } catch (error) {
        console.log('2nd page error', error); 
      }

      // console.log(nextPageOfData);
    }

    // 3. for each page, post all products to ES
    // 4. notify on success

    // const totalPages = await fetch()

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
