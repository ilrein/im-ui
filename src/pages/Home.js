import React, {
  useState,
  useEffect,
} from 'react';
import {
  Header,
  Container,
  Form,
  Loader,
} from 'semantic-ui-react';
import fetch from 'isomorphic-fetch';
import { withRouter } from 'react-router-dom';

import { API_URL } from '../constants';

const Home = ({ location }) => {
  // inventory-manager-1991.myshopify.com
  // movie-posters-shop.myshopify.com
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(true);

  const submit = async (SHOP) => {
    // console.log('submitting', SHOP);
    try {
      const get = await fetch(`${API_URL}/shopify?shop=${SHOP}`, {
        headers: {
          'Content-Type': 'application/json'
        },
      });

      const result = await get.json();

      console.log('redirecting...', result);

      window.location.href = result;
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (
      urlParams.get('shop')
      && urlParams.get('hmac')
      && urlParams.get('timestamp')
    ) {
      setValue(urlParams.get('shop'));
      // console.log(urlParams.get('shop'))
      submit(urlParams.get('shop'));
    } else {
      setLoading(false);
    }
  }, []); // eslint-disable-line

  return (
    <Container
      style={{ marginTop: '1rem' }}
    >
      <Header>
        Welcome to IM!
      </Header>
      
      {
        loading
          ? (
            <Loader
              active
              inline="centered"
            />
          )
          : (
            <Form>
              <Form.Input
                label="Shop Name"
                placeholder="inventory-manager-1991.myshopify.com"
                onChange={(event, { value }) => setValue(value)}
                value={value}
              />

              <Form.Button
                onClick={() => submit(value)}
              >
                Install App
              </Form.Button>
            </Form>
          )
      }
    </Container>
  )
}

export default withRouter(Home);
