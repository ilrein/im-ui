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

const NewMetafieldModal = ({
  open,
  handleClose,
}) => {
  const [creating, setCreating] = useState(false);
  const [fields, setFields] = useState([
    {
      namespace: '',
      key: '',
      value: '',
      type: String,
    },
  ]);

  const create = async () => {
    try {
      // const post = await fetch()
      console.log('create');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
    >
      <Header
        content="New Metafield"
      />
      <Modal.Content>
        <Form>
          {
            fields.map(field => (
              <Form.Group
                as={Segment}
              >
                <Form.Input
                  label="namespace"
                  placeholder={field.placeholder}
                />
                <Form.Input
                  label="key"
                  placeholder={field.key}
                />
                <Form.Input
                  label="value"
                  placeholder={field.value}
                />
                <Form.Input
                  label="type"
                  placeholder={field.type}
                />
              </Form.Group>
            ))
          }
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          color="green"
          onClick={create}
          inverted
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
