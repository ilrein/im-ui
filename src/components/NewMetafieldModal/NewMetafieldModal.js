import React, {
  useState,
  useRef,
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

// ramda utils
import dropLast from 'ramda/src/dropLast';
import isEmpty from 'ramda/src/isEmpty';
import update from 'ramda/src/update';

const field = {
  id: Math.random(),
  namespace: '',
  key: '',
  value: '',
  type: String,
};

const NewMetafieldModal = ({
  open,
  handleClose,
}) => {
  const [creating, setCreating] = useState(false);
  const [fields, setFields] = useState([field]);

  const create = async () => {
    setCreating(true);

    try {
      // const post = await fetch()
      
      // const check = fields.map(field => {
      //   if (isEmpty(field.namespace)) return false;
      //   if (isEmpty(field.key)) return false;
      //   if (isEmpty(field.value)) return false;

      //   return true;
      // })

      // console.log(check[0]);
      // console.log(fields);

      console.log(fields.some(element => isEmpty(element.namespace)))
    } catch (error) {
      console.log(error);
    }

    setCreating(false);
  }

  const increment = () => setFields([...fields, field])

  const decrement = () => setFields(dropLast(1, fields))

  const namespaceInput = useRef(null);
  const keyInput = useRef(null);
  const valueInput = useRef(null);

  const updateWithIndex = (index, property, newValue) => {
    const item = fields[index];

    const newObject = {
      ...item,
      [property]: newValue,
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
                />
                <Form.Input
                  label="value"
                  placeholder="1z2d2f3z"
                  onChange={(event, { value }) => updateWithIndex(index, 'value', value)}
                  required
                />
                <Form.Dropdown
                  label="type"
                  fluid
                  selection
                  defaultValue="String"
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
  // ({ ui }) => ({ ui }),
  // dispatch => ({
  //   changePropVisibility: (key, payload) => dispatch({
  //     type: 'CHANGE_PROP_VISIBILITY',
  //     key,
  //     payload,
  //   })
  // }),
)(withRouter(NewMetafieldModal));
