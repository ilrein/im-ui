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
import { connect } from 'react-redux';

// local
import { API_URL } from '../constants';
import Navbar from '../components/Navbar';
import InnerDashboard from '../containers/InnerDashboard';

const Dashboard = ({ location, history, stashSessionData }) => {
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

      stashSessionData({
        shop: qs.parse(location.search).shop,
        token: result,
      })
    } catch (error) {
      history.push('/shopify?shop=inventory-manager-1991.myshopify.com');
    }

    setLoading(false);
  }

  const checkIfShopIndexExists = async () => {
    setLoading(true);

    try {
      const get = await fetch(`${API_URL}/api/es/shop/create?shop=${shop}`, {
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
    checkIfShopIndexExists()
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

export default connect(
  null,
  dispatch => ({
    stashSessionData: payload => dispatch({
      type: 'STASH_SESSION_DATA',
      payload,
    })
  }),
)(withRouter(Dashboard));
