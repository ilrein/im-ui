import React, {
  useState,
  useEffect,
} from 'react';
import {
  Container,
  Message,
} from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import fetch from 'isomorphic-fetch';

import { API_URL } from '../constants';

const Shopify = ({ location }) => {
  const [loading, setLoading] = useState(false);

  const onMount = async () => {
    setLoading(true);

    try {
      const get = await fetch(`${API_URL}/shopify?${location.search}`, {
        headers: {
          'Content-Type': 'application/json'
        },
      });

      const result = await get.json();

      window.location.href = result;
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  }

  useEffect(() => {
    onMount();
  }, []); // eslint-disable-line

  return (
    <Container>
      <Message
        loading={loading.toString()}
      />
    </Container>
  )
}

export default withRouter(Shopify);
