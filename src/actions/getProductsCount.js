import fetch from 'isomorphic-fetch';

import { API_URL } from '../constants';

const getProductsCount = async (token) => {
  try {
    const get = await fetch(`${API_URL}/api/shopify/products/count.json`, {
      headers: {
        token,
      },
    })

    const result = await get.json();

    console.log(result);

    return result;
  } catch (error) {
    return error;
  }
};

export default getProductsCount;
