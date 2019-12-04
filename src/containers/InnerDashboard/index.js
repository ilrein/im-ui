import React from 'react';

import TotalShopifyProducts from '../../components/TotalShopifyProducts';

const InnerDashboard = (props) => {
  return (
    <>
      inner dashboard

      <TotalShopifyProducts
        {...props}
      />
    </>
  )
};

export default InnerDashboard;
