import React, {
  useState,
  useEffect,
} from 'react';
import {
  Segment,
} from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import fetch from 'isomorphic-fetch';
import qs from 'query-string';

// local
import { API_URL } from '../constants';
import Navbar from '../components/Navbar';
import InnerDashboard from '../containers/InnerDashboard';

const Dashboard = ({ location, history }) => {
  const [loading, setLoading] = useState(false); // eslint-disable-line
  const [token, setToken] = useState(null);
  const [shop, setShop] = useState(null);
  const [indexExists, setIndexExists] = useState(false)

  const getPermanentToken = async () => {
    setLoading(true);

    try {
      const get = await fetch(`${API_URL}/shopify/callback${location.search}`)
      const result = await get.json();

      setShop(qs.parse(location.search).shop);
      setToken(result);
      console.log(result);
    } catch (error) {
      history.push('/shopify?shop=inventory-manager-1991.myshopify.com');
    }

    setLoading(false);
  }

  const checkIfShopNameIndexExists = async () => {
    setLoading(true);

    try {
      const get = await fetch(`${API_URL}/api/createIndex`, {
        headers: {
          shop,
        },
      })
      const result = await get.json();

      setIndexExists(result);
    } catch (error) {
      // no index exists
    }

    setLoading(false);
  }

  useEffect(() => {
    getPermanentToken();
    checkIfShopNameIndexExists()
  }, []); // eslint-disable-line

  return (
    <Segment
      basic
      loading={loading}
      style={{ padding: 0 }}
    >
      <Navbar />
      
      {
        token
        && shop
        && indexExists
          ? <InnerDashboard token={token} shop={shop} />
          : null
      }
    </Segment>
  )
}

export default withRouter(Dashboard);
