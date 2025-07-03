const Order = require("../entities/general/order");

class ListOrdersService {
    static createManyOrders = async function (listOrders, domain) {
        if (!listOrders || listOrders.length === 0) return;

        const existingCount = await Order.countDocuments({ domain });
        if (existingCount > 0) return;

        const transformedOrderData = listOrders.map(order => ({
            domain: domain,
            orderId: order.id,
            amount: order.amount,
            currencyCode: order.currencyCode,
            paymentTerms: order.paymentTerms,
            country: order.country,
            totalTax: order.totalTax,
            taxExempt: order.taxExempt
        }));

        return Order.insertMany(transformedOrderData, { ordered: false });
    }

    static updateCurrencyCode = async function (domain, orders) {
        if (!orders?.length) return;
        const currencyCode = orders[0].currencyCode;
        return Order.updateMany(
            { 
                domain,
                $or: [
                    { currencyCode: { $exists: false } },
                    { currencyCode: null },
                    { currencyCode: "" }
                ]
            }, 
            { $set: { currencyCode } }
        );
    }

    static async getOrderStatistics(domain) {
        if (!domain) {
            return {
                totalOrders: 0,
                averageOrderValue: 0,
                orderDateRange: null,
                currencyCode: null
            };
        }

        try {
            const aggregationPipeline = [
                {
                    $match: { domain: domain }
                },
                {
                    $group: {
                        _id: null,
                        totalOrders: { $sum: 1 },
                        totalAmount: { 
                            $sum: { 
                                $convert: { 
                                    input: "$amount", 
                                    to: "double",
                                    onError: 0,
                                    onNull: 0
                                }
                            }
                        },
                        currencyCode: { $first: "$currencyCode" },
                        maxCreatedAt: { $max: "$createdAt" }
                    }
                }
            ];

            const results = await Order.aggregate(aggregationPipeline).exec();
            
            if (results.length === 0) {
                return {
                    totalOrders: 0,
                    averageOrderValue: 0,
                    orderDateRange: null,
                    currencyCode: null
                };
            }

            const stats = results[0];

            let orderDateRange = null;
            if (stats.maxCreatedAt) {
                const toDate = new Date(stats.maxCreatedAt); 
                const fromDate = new Date(toDate);
                fromDate.setMonth(fromDate.getMonth() - 2);
                orderDateRange = {
                    from: fromDate,   
                    to: toDate    
                };
            }
            
            return {
                totalOrders: stats.totalOrders,
                averageOrderValue: stats.totalOrders > 0 ? 
                    Math.round((stats.totalAmount / stats.totalOrders) * 100) / 100 : 0,
                orderDateRange: orderDateRange,
                currencyCode: stats.currencyCode
            };

        } catch (error) {
            console.error(error);
            return {
                totalOrders: 0,
                averageOrderValue: 0,
                orderDateRange: null,
                currencyCode: null
            };
        }
    }
}
module.exports = ListOrdersService
