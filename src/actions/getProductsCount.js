import fetch from 'isomorphic-fetch';

import { API_URL } from '../constants';

const getProductsCount = async () => {
  try {
    const get = await fetch(`${API_URL}/api/shopify/products/count.json`)

    const result = await get.json;

    return result;
  } catch (error) {
    return error;
  }
};

export default getProductsCount;
