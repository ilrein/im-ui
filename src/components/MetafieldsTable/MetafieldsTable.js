import React, { useState } from 'react';
import {
  Table,
  Label,
  Button,
  Icon
} from 'semantic-ui-react';
import { connect } from 'react-redux';

import NewMetafieldModal from '../NewMetafieldModal';
import UpdateMetafieldModal from '../UpdateMetafieldModal';

const MetafieldsTable = ({
  es,
}) => {
  const [newModalIsOpen, setNewModalIsOpen] = useState(false);
  const [updateModalIsOpen, setUpdateModalIsOpen] = useState(false);

  return (
    <>
      <NewMetafieldModal
        open={newModalIsOpen}
        handleClose={() => setNewModalIsOpen(false)}
      />
      <UpdateMetafieldModal
        open={updateModalIsOpen}
        handleClose={() => setUpdateModalIsOpen(false)}
      />
      <Table
        celled
        striped
        className="fade-in"
      >
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan='3'>
              Metafields
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {
            es.products.list.map(product => (
              <Table.Row
                key={product._source.id}
              >
                <Table.Cell collapsing>
                  {product._source.title}
                </Table.Cell>
                <Table.Cell>
                  {
                    product._source.metafields.map(metafield => (
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
                </Table.Cell>
                <Table.Cell collapsing>
                  <Button
                    icon
                    color="teal"
                    onClick={() => setNewModalIsOpen(true)}
                  >
                    <Icon name="plus" />
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))
          }
        </Table.Body>
      </Table>
    </>
  )
}

export default connect(
  ({ es }) => ({ es }),
)(MetafieldsTable);
