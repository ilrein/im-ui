import React, {
  // useState,
  // useEffect,
} from 'react';
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
  onApply,
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
                label={property.key}
                checked={property.visible}
              />
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
          onClick={onApply}
          inverted
        >
          <Icon name="checkmark" /> Apply
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default connect(
  ({ ui }) => ({ ui }),
)(withRouter(ConfigureModal));
