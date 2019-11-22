import React, {
  useState,
} from 'react';
import {
  Container,
  Button,
  Message,
} from 'semantic-ui-react';
// import fetch from 'isomorphic-fetch';

const Home = ({ accessToken, shop, appUrl }) => {
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState(null);

  return (
    <Container>
      home
    </Container>
  )
}

export default Home;
