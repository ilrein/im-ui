import React, {
  useState,
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
  Label,
  Icon,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

import { API_URL } from '../../constants';
import SyncManager from '../../components/SyncManager';
import ConfigureModal from '../../components/ConfigureModal';
import ProductModal from '../../components/ProductModal';
import NewMetafieldModal from '../../components/NewMetafieldModal';

const HoverableRow = styled(Table.Row)`
  // transition: all 0.25s ease-in-out;
  // cursor: pointer;

  // &:hover {
  //   background-color: #eee;
  // }
`;

const DynamicHeaderCell = styled(Table.HeaderCell)`
  display: ${props => props.visible === 'true' ? 'table-cell' : 'none'};
`;

const DynamicCell = styled(Table.Cell)`
  display: ${props => props.visible ? 'table-cell' : 'none'};
`;

const InnerDashboard = ({
  shop,
  stashProducts,
  ui,
  es,
}) => {
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [hasSearchedOnce, setHasSearchedOnce] = useState(false);
  const [configureModalIsOpen, setConfigureModalIsOpen] = useState(false);
  const [productModalIsOpen, setProductModalIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [currentlySelectedProduct, setCurrentlySelectedProduct] = useState(null);
  const [newModalIsOpen, setNewModalIsOpen] = useState(false);

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
      <SyncManager />

      {
        currentlySelectedProduct
        && currentlySelectedProduct.id
          ? (
            <NewMetafieldModal
              open={newModalIsOpen}
              handleClose={() => setNewModalIsOpen(false)}
              productId={currentlySelectedProduct.id}
            />
          )
          : null
      }

      <Form>
        <Header
          style={{ margin: '2rem 0' }}
        >
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
            <Segment
              style={{ height: '10rem' }}
              className="fade-in"
            >
              <Dimmer active inverted>
                <Loader inverted content="Loading" />
              </Dimmer>
            </Segment>
          )
          : null
      }

      {
        es.products.list.length > 0
        && !searching
          ? (
            <>
              <Table
                celled
                stackable
                className="fade-in"
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
                    es.products.list.map((product) => (
                      <HoverableRow
                        key={product.id}
                        // onClick={() => handleRowClick(product)}
                      >
                        <DynamicCell
                          visible={ui.properties.find(element => element.key === 'id' && element.visible === true)}
                        >
                          {product.id}
                        </DynamicCell>
                        <DynamicCell
                          visible={ui.properties.find(element => element.key === 'title' && element.visible === true)}
                        >
                          {product.title}
                        </DynamicCell>
                        <DynamicCell
                          visible={ui.properties.find(element => element.key === 'body_html' && element.visible === true)}
                        >
                          {product.body_html}
                        </DynamicCell>
                        <DynamicCell
                          visible={ui.properties.find(element => element.key === 'vendor' && element.visible === true)}
                        >
                          {product.vendor}
                        </DynamicCell>
                        <DynamicCell
                          visible={ui.properties.find(element => element.key === 'product_type' && element.visible === true)}
                        >
                          {product.product_type}
                        </DynamicCell>
                        <DynamicCell
                          visible={ui.properties.find(element => element.key === 'created_at' && element.visible === true)}
                        >
                          {product.created_at}
                        </DynamicCell>
                        <DynamicCell
                          visible={ui.properties.find(element => element.key === 'handle' && element.visible === true)}
                        >
                          {product.handle}
                        </DynamicCell>
                        <DynamicCell
                          visible={ui.properties.find(element => element.key === 'updated_at' && element.visible === true)}
                        >
                          {product.updated_at}
                        </DynamicCell>
                        <DynamicCell
                          visible={ui.properties.find(element => element.key === 'published_at' && element.visible === true)}
                        >
                          {product.published_at}
                        </DynamicCell>
                        <DynamicCell
                          visible={ui.properties.find(element => element.key === 'tags' && element.visible === true)}
                        >
                          {product.tags}
                        </DynamicCell>
                        <DynamicCell
                          visible={ui.properties.find(element => element.key === 'metafields' && element.visible === true)}
                        >
                          {
                            product.metafields.map(metafield => (
                              <div
                                key={metafield.id}
                                style={{ marginBottom: '0.25rem' }}
                              >
                                <Label>
                                  {metafield.key}: {metafield.value}
                                </Label>
                              </div>
                            ))
                          }

                          <Button
                            icon
                            color="teal"
                            size="tiny"
                            onClick={() => {
                              setCurrentlySelectedProduct(product);
                              setNewModalIsOpen(true);
                            }}
                          >
                            <Icon name="plus" />
                          </Button>
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
        es.products.list.length === 0
        && !searching
        && hasSearchedOnce
          ? (
            <>
              <Table
                celled
                className="fade-in"
              >
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
  ({ shopify, ui, es }) => ({ shopify, ui, es }),
  dispatch => ({
    stashProducts: payload => dispatch({
      type: 'STASH_PRODUCTS_ES',
      payload,
    }),
  }),
)(withRouter(InnerDashboard));
