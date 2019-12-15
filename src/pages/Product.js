import React, {
  // useState,
  // useEffect,
} from 'react';
import {
  Segment,
} from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
// import fetch from 'isomorphic-fetch';
import { connect } from 'react-redux';

// local
// import { API_URL } from '../constants';
import Navbar from '../components/Navbar';

const Product = ({ product }) => {
  const { _source } = product;

  return (
    <Segment
      basic
      style={{ padding: 0 }}
    >
      <Navbar
        hasBack
      />
      
      <Segment
        style={{ margin: '0 4rem' }}
      >
        {_source.id}
      </Segment>
    </Segment>
  )
}

export default connect(
  ({ product }) => ({ product }),
)(withRouter(Product));
