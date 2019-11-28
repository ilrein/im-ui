import React, {
  useState,
  useEffect,
} from 'react';
import {
  Statistic,
} from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import fetch from 'isomorphic-fetch';

import { API_URL } from '../constants';

const Dashboard = ({ location }) => {
  const [loading, setLoading] = useState(false); // eslint-disable-line
  const [token, setToken] = useState('');

  const getPermanentToken = async () => {
    if (token.length > 0) return;
    setLoading(true);

    try {
      const get = await fetch(`${API_URL}/shopify/callback${location.search}`)
      const result = await get.json();

      // hello
      setToken(result);
      console.log(result);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  }

  useEffect(() => {
    getPermanentToken()
  }, []); // eslint-disable-line

  return (
    <div>
      <Statistic.Group>
        <Statistic>
          <Statistic.Value>22</Statistic.Value>
          <Statistic.Label>Faves</Statistic.Label>
        </Statistic>
        <Statistic>
          <Statistic.Value>31,200</Statistic.Value>
          <Statistic.Label>Views</Statistic.Label>
        </Statistic>
      </Statistic.Group>
    </div>
  )
}

export default withRouter(Dashboard);
