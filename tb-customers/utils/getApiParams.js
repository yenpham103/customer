const getApiParams = (accessToken, method) => {
  return {
    method: method,
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json',
    },
    body: null,
  };
}

module.exports = getApiParams