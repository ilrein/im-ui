import React, {
  useState,
  // useEffect,
} from 'react';
import {
  Container,
  Button,
  Segment,
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
import ConfigureModal from '../../components/ConfigureModal';
import ProductModal from '../../components/ProductModal';

const HoverableRow = styled(Table.Row)`
  transition: all 0.25s ease-in-out;
  cursor: pointer;

  &:hover {
    background-color: #eee;
  }
`;

const DynamicHeaderCell = styled(Table.HeaderCell)`
  display: ${props => props.visible === 'true' ? 'table-cell' : 'none'};
`;

const DynamicCell = styled(Table.Cell)`
  display: ${props => props.visible ? 'table-cell' : 'none'};
`;

const InnerDashboard = ({
  shopify,
  shop,
  token,
  stashProducts,
  stashProductCount,
  ui,
}) => {
  const [syncing, setSyncing] = useState(false);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [data, setData] = useState([]);
  const [hasSearchedOnce, setHasSearchedOnce] = useState(false);
  const [configureModalIsOpen, setConfigureModalIsOpen] = useState(false);
  const [productModalIsOpen, setProductModalIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

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

      setData(searchResult);
      stashProducts(searchResult);
    } catch (error) {
      console.log(error);
    }

    setSearching(false);
  }

  const handleRowClick = async (product) => {
    setSelectedProduct(product);
    setProductModalIsOpen(true);
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
        <Header>
          Search Products
        </Header>
        <div
          className="search-products-input"
        >
          <Form.Input
            action={{
              color: 'teal',
              content: 'Search',
              onClick: () => handleSearch(),
              type: 'submit',
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
            onClick={() => setConfigureModalIsOpen(true)}
          >
            Configure
          </Button>
          <ConfigureModal
            open={configureModalIsOpen}
            handleClose={() => setConfigureModalIsOpen(false)}
          />
          {
            selectedProduct
              ? (
                <ProductModal
                  open={productModalIsOpen}
                  handleClose={() => setProductModalIsOpen(false)}
                  product={selectedProduct}
                />
              )
              : null
          }
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
                      ui.properties.map((property) => (
                        <DynamicHeaderCell
                          key={property.key}
                          visible={property.visible.toString()}
                        >
                          {property.key}
                        </DynamicHeaderCell>
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
                          visible={ui.properties.find(element => element.key === 'id' && element.visible === true)}
                        >
                          {product._source.id}
                        </DynamicCell>
                        <DynamicCell
                          visible={ui.properties.find(element => element.key === 'title' && element.visible === true)}
                        >
                          {product._source.title}
                        </DynamicCell>
                        <DynamicCell
                          visible={ui.properties.find(element => element.key === 'body_html' && element.visible === true)}
                        >
                          {product._source.body_html}
                        </DynamicCell>
                        <DynamicCell
                          visible={ui.properties.find(element => element.key === 'vendor' && element.visible === true)}
                        >
                          {product._source.vendor}
                        </DynamicCell>
                        <DynamicCell
                          visible={ui.properties.find(element => element.key === 'product_type' && element.visible === true)}
                        >
                          {product._source.product_type}
                        </DynamicCell>
                        <DynamicCell
                          visible={ui.properties.find(element => element.key === 'created_at' && element.visible === true)}
                        >
                          {product._source.created_at}
                        </DynamicCell>
                        <DynamicCell
                          visible={ui.properties.find(element => element.key === 'handle' && element.visible === true)}
                        >
                          {product._source.handle}
                        </DynamicCell>
                        <DynamicCell
                          visible={ui.properties.find(element => element.key === 'updated_at' && element.visible === true)}
                        >
                          {product._source.updated_at}
                        </DynamicCell>
                        <DynamicCell
                          visible={ui.properties.find(element => element.key === 'published_at' && element.visible === true)}
                        >
                          {product._source.published_at}
                        </DynamicCell>
                        <DynamicCell
                          visible={ui.properties.find(element => element.key === 'tags' && element.visible === true)}
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
    stashProducts: payload => dispatch({
      type: 'STASH_PRODUCTS_ES',
      payload,
    }),
    stashProductCount: payload => dispatch({
      type: 'STASH_PRODUCTS_COUNT_ES',
      payload,
    }),
  }),
)(withRouter(InnerDashboard));
