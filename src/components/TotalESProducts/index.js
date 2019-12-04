import React, {
  useState,
  useEffect,
} from 'react';
import fetch from 'isomorphic-fetch';
import { Statistic } from 'semantic-ui-react';

import { API_URL } from '../../constants';

const TotalESProducts = ({ token, shop }) => {
  const [count, setCount] = useState(0);

  const getProductsCount = async (token, shop) => {
    try {
      const get = await fetch(`${API_URL}/api/products/count`, {
        headers: {
          token,
          shop,
        },
      })
  
      const result = await get.json();
  
      setCount(result.count);
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    getProductsCount(token, shop);
  }, []); // eslint-disable-line

  return (
    <Statistic
      label="Total Synced Products"
      value={count}
    />
  )
};

export default TotalESProducts;
