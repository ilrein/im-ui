import React from 'react';
import { Container } from 'semantic-ui-react';

import TotalShopifyProducts from '../../components/TotalShopifyProducts';
import TotalESProducts from '../../components/TotalESProducts';

const InnerDashboard = (props) => {
  return (
    <Container
      style={{ marginTop: '1rem' }}
    >
      <TotalShopifyProducts
        {...props}
      />

      <TotalESProducts
        {...props}
      />
    </Container>
  )
};

export default InnerDashboard;
