import React from 'react';
import {
  Modal,
  Button,
  Icon,
  Header,
  Form,
} from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

const ConfigureModal = ({
  ui,
  open,
  handleClose,
  changePropVisibility,
}) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="small"
    >
      <Header
        icon="settings"
        content="Configure"
      />
      <Modal.Content>
        <h4>
          Set which product properties are displayed by default:
        </h4>

        <Form>
          {
            ui.properties.map(property => (
              <Form.Checkbox
                key={property.key}
                label={property.key}
                checked={property.visible}
                onChange={(event, { checked }) => changePropVisibility(property.key, checked)}
              />
            ))
          }
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          color="green"
          onClick={handleClose}
          inverted
        >
          <Icon name="checkmark" /> Done
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default connect(
  ({ ui }) => ({ ui }),
  dispatch => ({
    changePropVisibility: (key, payload) => dispatch({
      type: 'CHANGE_PROP_VISIBILITY',
      key,
      payload,
    })
  }),
)(withRouter(ConfigureModal));
