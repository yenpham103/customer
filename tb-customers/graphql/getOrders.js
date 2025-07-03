const { GraphQL } = require(`@bss-sbc/shopify-api-fetcher`);

const getOrders = async (domain, accessToken) => {
    try {
        const twoMonthsAgo = new Date();
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
        const since = twoMonthsAgo.toISOString().split('T')[0];

        const batchSize = 50;
        let allOrders = [];
        let hasNextPage = true;
        let cursor = null;

        while (hasNextPage) {
            const getOrdersQuery = `
           query getOrders($first: Int!, $after: String) {
               orders(first: $first, after: $after, query: "created_at:>=${since}") {
                   pageInfo {
                       hasNextPage
                       endCursor
                   }
                   edges {
                       node {
                           id
                           totalPriceSet {
                               shopMoney {
                                   amount
                                   currencyCode
                               }
                           }
                           totalTaxSet {
                               shopMoney {
                                   amount
                               }
                           }
                           taxExempt
                           paymentTerms {
                               id
                               paymentTermsName
                               paymentTermsType
                               dueInDays
                           }
                           billingAddress {
                               country
                           }
                           customer {
                               defaultAddress {
                                   country
                               }
                           }
                       }
                   }
               }
           }`;

            const variables = {
                first: batchSize,
                after: cursor
            };

            const response = await GraphQL.safeFetch(domain, accessToken, {
                query: getOrdersQuery,
                variables: variables
            });

            if (!response?.data?.orders) {
                hasNextPage = false;
                continue;
            }

            const ordersData = response.data.orders;

            if (ordersData.edges?.length > 0) {
                const orders = ordersData.edges.map(edge => {
                    const node = edge.node;

                    const country = node.billingAddress?.country ||
                        node.customer?.defaultAddress?.country ||
                        null;

                    return {
                        id: node.id,
                        amount: node.totalPriceSet?.shopMoney?.amount || '0',
                        currencyCode: node.totalPriceSet?.shopMoney?.currencyCode || 'N/A',
                        totalTax: node.totalTaxSet?.shopMoney?.amount || '0',
                        taxExempt: node.taxExempt || false,
                        paymentTerms: node.paymentTerms || null,
                        country: country,
                    };
                });

                allOrders = allOrders.concat(orders);

                hasNextPage = ordersData.pageInfo.hasNextPage;
                cursor = ordersData.pageInfo.endCursor;

                if (hasNextPage) {
                    await new Promise(resolve => setTimeout(resolve, 250));
                }
            } else {
                hasNextPage = false;
            }
        }

        return allOrders;

    } catch (e) {
        if (e instanceof GraphQL.GraphqlError) {
            console.error({ level: "error", location: "graphql.getOrders", message: e.message, cause: e.cause, domain });
        } else {
            console.error({ level: "error", location: "graphql.getOrders.uncaught", message: e.message, domain });
        }
        return [];
    }
}

module.exports = getOrders;