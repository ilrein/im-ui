import React, {
  useState,
  useEffect,
} from 'react';
import fetch from 'isomorphic-fetch';

import { API_URL } from '../../constants';

const TotalShopifyProducts = ({ token, shop }) => {
  const [count, setCount] = useState(0);

  const getProductsCount = async (token, shop) => {
    try {
      const get = await fetch(`${API_URL}/api/shopify/products/count.json`, {
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
    <div>
      TotalShopifyProducts {count}
    </div>
  )
};

export default TotalShopifyProducts;
