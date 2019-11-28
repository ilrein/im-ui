import React, {
  useState,
} from 'react';
import {
  Container,
  Form,
} from 'semantic-ui-react';
import fetch from 'isomorphic-fetch';
import { withRouter } from 'react-router-dom';

import { API_URL } from '../constants';

const Home = ({ location }) => {
  const [loading, setLoading] = useState(false); // eslint-disable-line

  const [value, setValue] = useState(null);

  const submit = async () => {
    try {
      const get = await fetch(`${API_URL}/shopify?shop=${value}`, {
        headers: {
          'Content-Type': 'application/json'
        },
      });

      const result = await get.json();

      window.location.href = result;
      // console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Container
      style={{ marginTop: '1rem' }}
    >
      <Form>
        <Form.Input
          placeholder="Shop name"
          onChange={(event, { value }) => setValue(value)}
          defaultValue="inventory-manager-1991.myshopify.com"
        />

        <Form.Button
          onClick={submit}
        >
          Submit
        </Form.Button>
      </Form>
    </Container>
  )
}

export default withRouter(Home);
