import React, {
  useState,
} from 'react';
import {
  Container,
  Button,
  Message,
} from 'semantic-ui-react';
// import fetch from 'isomorphic-fetch';

const Dashboard = ({ accessToken, shop, appUrl }) => {
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState(null);

  return (
    <Container>
      {/* <Message
          header={shop}
          content={appUrl}
        /> */}

      {
        data
          ? (
            <Message
              header="Data"
              content={data}
            />
          )
          : null
      }

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
