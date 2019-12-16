import React, {
  useState,
} from 'react';
import {
  Header,
  Container,
  Form,
} from 'semantic-ui-react';
import fetch from 'isomorphic-fetch';
import { withRouter } from 'react-router-dom';

import { API_URL } from '../constants';

const Home = ({ location }) => {
  const [value, setValue] = useState('inventory-manager-1991.myshopify.com');

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

  return (
    <Container
      style={{ marginTop: '1rem' }}
    >
      <Header>
        Welcome to IM!
      </Header>
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
    </Container>
  )
}

export default withRouter(Home);
