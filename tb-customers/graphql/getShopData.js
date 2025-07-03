const { GraphQL } = require(`@bss-sbc/shopify-api-fetcher`);

const getShopData = async (domain, accessToken) => {
    try {
        const getShopQuery = `
        query {
            shop {
                allProductCategories {
                    productTaxonomyNode { 
                        name
                    }
                }
            }
        }`;

        const response = await GraphQL.safeFetch(domain, accessToken, {
            query: getShopQuery,
        });

        return response?.data?.shop;
    } catch (error) {
        if (error instanceof GraphQL.GraphqlError) {
            console.error({ level: "error", location: "graphql.getShopData", message: error.message, cause: error.cause, domain });
        } else {
            console.error({ level: "error", location: "graphql.getShopData.uncaught", message: error.message, domain });
        }
        return null;
    }
}

module.exports = getShopData
