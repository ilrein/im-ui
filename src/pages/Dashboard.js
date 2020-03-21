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
import SocketConnection from '../containers/SocketConnection';

const Dashboard = ({
  location,
  history,
  stashSessionData,
  session,
}) => {
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
      history.push(`/shopify?shop=${session.shop}`);
    }

    setLoading(false);
  }

  //
  // This is GET
  // but it will perform a DB insertion
  // if the shop is not found
  //
  const checkIfShopIndexExistsAndCreateIfNoneFound = async () => {
    if (shop === null) return;
    
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
      console.log('index check error', error);
      // no index exists
    }

    setLoading(false);
  }

  useEffect(() => {
    getPermanentToken();
  }, []); // eslint-disable-line

  useEffect(() => {
    checkIfShopIndexExistsAndCreateIfNoneFound()
  }, [shop]); // eslint-disable-line

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
          ? (
            <SocketConnection>
              <InnerDashboard token={token} shop={shop} />
            </SocketConnection>
          )
          : null
      }
    </Segment>
  )
}

export default connect(
  ({ session }) => ({ session }),
  dispatch => ({
    stashSessionData: payload => dispatch({
      type: 'STASH_SESSION_DATA',
      payload,
    })
  }),
)(withRouter(Dashboard));
