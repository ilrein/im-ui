import React, {
  useState,
  useEffect,
} from 'react';

import getProductsCount from '../../actions/getProductsCount';

const TotalShopifyProducts = ({ token }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const result = getProductsCount();
    setCount(result);
  }, [token]);

  return (
    <div>
      TotalShopifyProducts
    </div>
  )
};

export default TotalShopifyProducts;
