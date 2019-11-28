import React, {
  useState,
} from 'react';
import {
  Container,
  Button,
} from 'semantic-ui-react';

const Dashboard = () => {
  const [loading, setLoading] = useState(false); // eslint-disable-line

  return (
    <Container
      style={{ marginTop: '1rem' }}
    >

      <Button
        primary
        onClick={() => alert('wtf')}
        loading={loading}
      >
        Sync all products
        </Button>
    </Container>
  )
}

export default Dashboard;
