const { Rest } = require(`@bss-sbc/shopify-api-fetcher`);
const getApiParams = require("./getApiParams");

const API_VERSION = process.env.API_VERSION || "2024-07";

const getShopProperties = async (domain, accessToken) => {
    let shop = {};
    const params = getApiParams(accessToken, 'GET');
    let url = `https://${domain}/admin/api/${API_VERSION}/shop.json`;

    try {
        const response = await Rest.safeFetch(domain, url, params);
        if (response && response.status === 200) {
            const json = await response.json();
            shop = json.shop;
        }
    } catch (e) {
        console.error(e);
    }
    return shop;
}

module.exports = getShopProperties