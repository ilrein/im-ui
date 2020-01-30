import React, {
  useState,
} from 'react';
import {
  Modal,
  Button,
  Icon,
  Header,
  Form,
  Segment,
} from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import fetch from 'isomorphic-fetch';
import { toast } from 'react-toastify';

// ramda utils
import dropLast from 'ramda/src/dropLast';
import isEmpty from 'ramda/src/isEmpty';
import update from 'ramda/src/update';

import { API_URL } from '../../constants';

const field = () => ({
  id: Math.random(),
  namespace: '',
  key: '',
  value: '',
  type: 'String',
});

const NewMetafieldModal = ({
  open,
  handleClose,
  productId,
  session,
}) => {
  const [creating, setCreating] = useState(false);
  const [fields, setFields] = useState([field()]);

  const create = async () => {
    setCreating(true);

    try {
      // console.log(productId);
      const { shop, token } = session;

      const post = await fetch(`${API_URL}/api/shopify/products/${productId}/metafields`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          shop,
          token,
        },
        body: JSON.stringify(fields)
      });

      await post.json();

      toast.success('Sending update...please wait a few minutes.');
      handleClose();
      setFields([field()])
    } catch (error) {
      console.log(error);
    }

    setCreating(false);
  }

  const increment = () => setFields([...fields, field()])

  const decrement = () => setFields(dropLast(1, fields))

  const updateWithIndex = (index, property, newValue) => {
    const item = fields[index];

    const newObject = {
      ...item,
      [property]: newValue,
    };

    const changed = update(index, newObject, fields);

    setFields(changed);
  }

  const setType = (index, newValue) => {
    const item = fields[index];

    const newObject = {
      ...item,
      value: '',
      type: newValue,
    };

    const changed = update(index, newObject, fields);

    setFields(changed);
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
    >
      <Header
        content="New Metafield(s)"
      />
      <Modal.Content>
        <Form>
          {
            fields.map((field, index) => (
              <Form.Group
                as={Segment}
                key={field.id}
                widths="equal"
              >
                <Form.Input
                  label="namespace"
                  placeholder="global"
                  onChange={(event, { value }) => updateWithIndex(index, 'namespace', value)}
                  value={field.namespace}
                  required
                />
                <Form.Input
                  label="key"
                  placeholder="analytics"
                  onChange={(event, { value }) => updateWithIndex(index, 'key', value)}
                  required
                  value={field.key}
                />
                <Form.Input
                  label="value"
                  placeholder={field.type === 'String' ? '1z2d2f3z' : '12837213'}
                  onChange={(event, { value }) => updateWithIndex(index, 'value', value)}
                  required
                  value={field.value}
                  type={field.type === 'String' ? 'text' : '12837213'}
                />
                <Form.Dropdown
                  label="type"
                  fluid
                  selection
                  defaultValue={field.type}
                  onChange={(event, { value }) => setType(index, value)}
                  options={[
                    {
                      key: 'String',
                      text: 'String',
                      value: 'String',
                    },
                    {
                      key: 'Number',
                      text: 'Number',
                      value: 'Number',
                    },
                  ]}
                />
              </Form.Group>
            ))
          }
        </Form>

        <Button.Group>
          <Button
            disabled={fields.length === 1}
            onClick={decrement}
          >
            Decrement
          </Button>
          <Button.Or />
          <Button
            positive
            onClick={increment}
          >
            Increment
          </Button>
        </Button.Group>
      </Modal.Content>
      <Modal.Actions>
        <Button
          onClick={handleClose}
          disabled={creating}
        >
          Cancel
        </Button>
        <Button
          color="green"
          onClick={create}
          loading={creating}
          inverted
          disabled={
            fields.some(element => isEmpty(element.namespace))
            || fields.some(element => isEmpty(element.key))
            || fields.some(element => isEmpty(element.value))
          }
        >
          <Icon name="checkmark" /> Create
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default connect(
  ({ session }) => ({ session }),
  // dispatch => ({
  //   changePropVisibility: (key, payload) => dispatch({
  //     type: 'CHANGE_PROP_VISIBILITY',
  //     key,
  //     payload,
  //   })
  // }),
)(withRouter(NewMetafieldModal));
