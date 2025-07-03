const ShopDetail = require("../entities/general/shop-detail");

class ShopDetailService {
    static createOrUpdateShopDetail = async function (shopData) {
        const transformedData = {
            domain: shopData.myshopify_domain,
            email: shopData.email,
            customerEmail: shopData.customer_email,
            shopId: shopData.id,
            shopCreatedAt: shopData.created_at ? new Date(shopData.created_at) : null,
            storeName: shopData.name,
            planName: shopData.plan_name,
            planDisplayName: shopData.plan_display_name,
            country: shopData.country,
            productCategories: shopData.allProductCategories?.map(cat => cat.productTaxonomyNode?.name) || []
        };

        return await ShopDetail.findOneAndUpdate({ domain: shopData.myshopify_domain }, transformedData, { upsert: true, new: true }).exec();
    }

    static findShopDetail = async function (domain) {
        const shop = await ShopDetail.findOne({ domain }).exec();
        return shop;
    }

    static countStoresByCountry = async function (country) {
        if (!country) return 0;
        return await ShopDetail.countDocuments({ country }).exec();
    } 


    static getCategoryStoreStats = async function (categories) {
        if (!Array.isArray(categories) || categories.length === 0) {
            return {};
        }

        try {
            const aggregationPipeline = [
                {
                    $unwind: "$productCategories"
                },
                {
                    $match: {
                        productCategories: { $in: categories }
                    }
                },
                {
                    $group: {
                        _id: "$productCategories",
                        totalStoreHasCategory: { $sum: 1 }
                    }
                },
                {
                    $sort: { totalStoreHasCategory: -1 }
                }
            ];

            const aggregationResults = await ShopDetail.aggregate(aggregationPipeline).exec();

            return this._mapCategoryStatsResults(aggregationResults);

        } catch (error) {
            console.error(error);
            return {};
        }
    }

    static _mapCategoryStatsResults = function (results) {
        const categoryStatsMap = {};

        results.forEach(({ _id: categoryName, totalStoreHasCategory }) => {
            if (categoryName && typeof totalStoreHasCategory === 'number') {
                categoryStatsMap[categoryName] = totalStoreHasCategory;
            }
        });

        return categoryStatsMap;
    }

}

module.exports = ShopDetailService