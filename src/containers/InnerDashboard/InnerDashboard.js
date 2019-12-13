import React, { useState } from 'react';
import {
  Container,
  Button,
  Segment,
  Form,
  Table,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import replace from 'ramda/src/replace';
// import isNil from 'ramda/src/isNil';
// import fetch from 'isomorphic-fetch';

import { API_URL } from '../../constants';
import TotalShopifyProducts from '../../components/TotalShopifyProducts';
import TotalESProducts from '../../components/TotalESProducts';

const InnerDashboard = ({ shopify, shop, token }) => {
  const [syncing, setSyncing] = useState(false);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [data, setData] = useState([]);

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

  const copyData = async (data) => {
    console.log('syncing to ES', data);
    try {
      const post = await fetch(`${API_URL}/api/es/products/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          shop,
        },
        body: JSON.stringify(data.products),
      });

      const result = await post.json();

      return result;
    } catch (error) {
      console.log(error);
    }
  };

  const handleSync = async () => {
    setSyncing(true);

    const limit = 2;
    const totalPages = shopify.products.count / limit;

    let newUrl = null;
    for (let index = 0; index < totalPages; index++) {
      const page = await getProductsFromShopify(newUrl);

      if (page.meta) {
        newUrl = replace('<', '', page.meta);
        newUrl = replace('>', '', newUrl);
      }

      // lets do a bulk insert with this new data
      await copyData(page.data);
    }

    setSyncing(false);
  }

  const handleSearch = async () => {
    setSearching(true);

    console.log('searching...', query);

    try {
      const get = await fetch(`${API_URL}/api/es/products?search=${query}`, {
        headers: {
          shop,
        },
      });

      const searchResult = await get.json();

      setData(searchResult);
    } catch (error) {
      console.log(error);
    }

    setSearching(false);
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

      <Form>
        <Form.Input
          action={{
            color: 'teal',
            content: 'Search',
            onClick: () => handleSearch(),
          }}
          onChange={(event, { value }) => setQuery(value)}
          placeholder="Search Products"
          loading={searching}
        />
      </Form>

      {
        data.length > 0
          ? (
            <>
              <Table celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Title</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {
                    data.map(({ _source }) => (
                      <Table.Row
                        key={_source.id}
                      >
                        <Table.Cell>
                          {_source.title}
                        </Table.Cell>
                      </Table.Row>
                    ))
                  }
                </Table.Body>
              </Table>
            </>
          )
          : null
      }
    </Container>
  )
}

export default connect(
  ({ shopify }) => ({ shopify }),
)(InnerDashboard);
