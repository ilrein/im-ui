import React, { useState } from 'react';
import {
  Container,
  Button,
  Segment,
  // Input,
  Table,
  Dimmer,
  Loader,
  Header,
  Form,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import replace from 'ramda/src/replace';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

import { API_URL } from '../../constants';
import TotalShopifyProducts from '../../components/TotalShopifyProducts';
import TotalESProducts from '../../components/TotalESProducts';

const HoverableRow = styled(Table.Row)`
  transition: all 0.25s ease-in-out;
  cursor: pointer;

  &:hover {
    background-color: #eee;
  }
`;

const DynamicCell = styled(Table.Cell)`
  display: ${props => props.visible ? 'table-cell' : 'none'};
`;

const InnerDashboard = ({
  shopify,
  shop,
  token,
  stashProduct,
  stashProducts,
  ui,
}) => {
  const [syncing, setSyncing] = useState(false);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [data, setData] = useState([]);
  const [hasSearchedOnce, setHasSearchedOnce] = useState(false);

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
    setHasSearchedOnce(true);
    setSearching(true);

    try {
      const get = await fetch(`${API_URL}/api/es/products?search=${query}`, {
        headers: {
          shop,
        },
      });

      const searchResult = await get.json();
      console.log('searchResult', searchResult);

      setData(searchResult);
      stashProducts(searchResult);
    } catch (error) {
      console.log(error);
    }

    setSearching(false);
  }

  const handleRowClick = async (product) => {
    stashProduct(product);
    console.log(product);
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

      <Form
        as={Segment}
      >
        <Header>
          Search Products
        </Header>
        <div
          class="search-products-input"
        >
          <Form.Input
            action={{
              color: 'teal',
              content: 'Search',
              onClick: () => handleSearch(),
            }}
            onChange={(event, { value }) => setQuery(value)}
            placeholder="Search Products"
            style={{ flex: 0.85 }}
          />

          <Button
            style={{
              flex: 0.1,
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
            }}
          >
            Configure
          </Button>
        </div>
      </Form>

      {
        searching
          ? (
            <Segment style={{ height: '10rem' }}>
              <Dimmer active inverted>
                <Loader inverted content="Loading" />
              </Dimmer>
            </Segment>
          )
          : null
      }

      {
        data.length > 0
        && !searching
          ? (
            <>
              <Table
                celled
                stackable
              >
                <Table.Header>
                  <Table.Row>
                    {
                      ui.visibleProperties.map((property) => (
                        <Table.Cell
                          key={property}
                        >
                          {property}
                        </Table.Cell>
                      ))
                    }
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {
                    data.map((product) => (
                      <HoverableRow
                        key={product._id}
                        onClick={() => handleRowClick(product)}
                      >
                        <DynamicCell
                          visible={ui.visibleProperties.includes('id')}
                        >
                          {product._source.id}
                        </DynamicCell>
                        <DynamicCell
                          visible={ui.visibleProperties.includes('title')}
                        >
                          {product._source.title}
                        </DynamicCell>
                        <DynamicCell
                          visible={ui.visibleProperties.includes('body_html')}
                        >
                          {product._source.body_html}
                        </DynamicCell>
                        <DynamicCell
                          visible={ui.visibleProperties.includes('vendor')}
                        >
                          {product._source.vendor}
                        </DynamicCell>
                        <DynamicCell
                          visible={ui.visibleProperties.includes('product_type')}
                        >
                          {product._source.product_type}
                        </DynamicCell>
                        <DynamicCell
                          visible={ui.visibleProperties.includes('created_at')}
                        >
                          {product._source.created_at}
                        </DynamicCell>
                        <DynamicCell
                          visible={ui.visibleProperties.includes('handle')}
                        >
                          {product._source.handle}
                        </DynamicCell>
                        <DynamicCell
                          visible={ui.visibleProperties.includes('updated_at')}
                        >
                          {product._source.updated_at}
                        </DynamicCell>
                        <DynamicCell
                          visible={ui.visibleProperties.includes('published_at')}
                        >
                          {product._source.published_at}
                        </DynamicCell>
                        <DynamicCell
                          visible={ui.visibleProperties.includes('tags')}
                        >
                          {product._source.tags}
                        </DynamicCell>
                      </HoverableRow>
                    ))
                  }
                </Table.Body>
              </Table>
            </>
          )
          : null
      }

      {
        data.length === 0
        && !searching
        && hasSearchedOnce
          ? (
            <>
              <Table celled>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>
                      No matches found.
                    </Table.Cell>
                  </Table.Row>
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
  ({ shopify, ui }) => ({ shopify, ui }),
  dispatch => ({
    stashProduct: payload => dispatch({
      type: 'STASH_PRODUCT',
      payload,
    }),
    stashProducts: payload => dispatch({
      type: 'STASH_PRODUCTS_ES',
      payload,
    }),
  }),
)(withRouter(InnerDashboard));
