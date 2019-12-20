import React from 'react';
import {
  Table,
} from 'semantic-ui-react';
import { connect } from 'react-redux';

const MetafieldsTable = ({
  es,
}) => {
  return (
    <Table celled striped>
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
                    >
                      {metafield.key}: {metafield.value}
                    </div>
                  ))
                }
              </Table.Cell>
            </Table.Row>
          ))
        }
      </Table.Body>
    </Table>
  )
}

export default connect(
  ({ es }) => ({ es }),
)(MetafieldsTable);
