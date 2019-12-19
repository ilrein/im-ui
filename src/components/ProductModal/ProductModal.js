import React, {
  // useState,
  // useEffect,
} from 'react';
import {
  Modal,
  Button,
  Icon,
  Header,
  // Form,
} from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

const ProductModal = ({
  open,
  handleClose,
  product,
}) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="small"
    >
      <Header
        content="Product"
      />
      <Modal.Content>
        <h4>
          {product._source.title}
        </h4>
      </Modal.Content>
      <Modal.Actions>
        <Button
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          color="green"
          onClick={handleClose}
          inverted
        >
          <Icon name="checkmark" /> Update
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
)(withRouter(ProductModal));
