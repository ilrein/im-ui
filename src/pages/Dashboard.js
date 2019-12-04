import React, {
  useState,
  useEffect,
} from 'react';
import {
  Segment,
} from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import fetch from 'isomorphic-fetch';

// local
import { API_URL } from '../constants';
import Navbar from '../components/Navbar';
import getProductsCount from '../actions/getProductsCount';

const Dashboard = ({ location, history }) => {
  const [loading, setLoading] = useState(false); // eslint-disable-line
  const [token, setToken] = useState('');

  const getPermanentToken = async () => {
    setLoading(true);

    try {
      const get = await fetch(`${API_URL}/shopify/callback${location.search}`)
      const result = await get.json();

      setToken(result);
    } catch (error) {
      history.push('/shopify?shop=inventory-manager-1991.myshopify.com');
    }

    setLoading(false);
  }

  useEffect(() => {
    getPermanentToken();
  }, []); // eslint-disable-line

  return (
    <Segment
      basic
      loading={loading}
      style={{ padding: 0 }}
    >
      <Navbar />
      
    </Segment>
  )
}

export default withRouter(Dashboard);
