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
  const [value, setValue] = useState('inventory-manager-1991.myshopify.com');
  const [loading, setLoading] = useState(true);

  const submit = async () => {
    try {
      const get = await fetch(`${API_URL}/shopify?shop=${value}`, {
        headers: {
          'Content-Type': 'application/json'
        },
      });

      const result = await get.json();

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
      submit();
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
                placeholder="Shop name"
                onChange={(event, { value }) => setValue(value)}
                value={value}
              />

              <Form.Button
                onClick={submit}
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
