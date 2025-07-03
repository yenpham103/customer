const { getShopData, getOrders } = require("../graphql");
const { getShopProperties } = require("../utils");
const { EVENTS, APPS } = require("../constants/appEvent.const");
const { IgnoreNicknameService, ListOrdersService, ShopService, ShopDetailService } = require("../services");

module.exports = {
    processAppEvent: async (ctx) => {
        try {
            const { event, domain, app } = ctx.request.body;
            const hash = ctx.request.body?.hash || '';

            if (!event || !domain || !app) {
                ctx.status = 400;
                ctx.body = { message: "Missing required fields" };
                return;
            }

            const eventsRequiringHash = [EVENTS.INSTALL];
            if (eventsRequiringHash.includes(event) && !hash) {
                ctx.status = 400;
                ctx.body = { message: "Hash is required for install events" };
                return;
            }


            if (event === EVENTS.INSTALL || event === EVENTS.REINSTALL) {
                const accessToken = Buffer.from(hash, 'base64').toString('utf-8');

                // get shop data & verify access token
                const [shopDataResult, shopInfo] = await Promise.all([
                    getShopData(domain, accessToken),
                    getShopProperties(domain, accessToken)
                ]);
                
                if (!shopDataResult || !shopInfo) {
                    throw new Error("Invalid access token app");
                }

                // save shop
                await ShopService.createOrUpdate({ domain, app, hash });

                // save shop detail
                const shopData = { ...shopInfo, allProductCategories: shopDataResult?.allProductCategories };
                await ShopDetailService.createOrUpdateShopDetail({ ...shopData });

                // save list orders
                if(app !== APPS.LOCK) {
                    const listOrders = await getOrders(domain, accessToken);
                    await ListOrdersService.createManyOrders(listOrders, domain);
                }
            } else if (event === EVENTS.UNINSTALL) {
                // remove shop
                await ShopService.removeHash({ domain, app });
            }

            ctx.body = {
                success: true,
                data: null // return data
            }

            console.info({level: "info", location: "controllers/store-data/processAppEvent", message: `${domain} ${event} ${app}`});
        } catch (error) {
            console.error(error);
            ctx.status = 500;
            ctx.body = {
                success: false,
                message: "error",
                data: error,
            }
        }
    },

    updateShopDetail: async (ctx) => {
        try {
            const { domain } = ctx.request.body
            
            if (!domain) {
                ctx.status = 400;
                ctx.body = {
                    message: "error",
                    data: "Domain is required"
                }
                return;
            }

            const shop = await ShopService.findShopByDomain(domain);
            
            if (!shop) {
                ctx.status = 404;
                ctx.body = {
                    success: false,
                    message: "Shop not found"
                }
                return;
            }

            let accessToken = null;

            if (shop.hashSolution) {
                accessToken = Buffer.from(shop.hashSolution, 'base64').toString('utf-8');
            } else if (shop.hashPortal) {
                accessToken = Buffer.from(shop.hashPortal, 'base64').toString('utf-8');
            } else if (shop.hashLock) {
                accessToken = Buffer.from(shop.hashLock, 'base64').toString('utf-8');
            }

            if (!accessToken) {
                ctx.status = 400;
                ctx.body = {
                    success: false,
                    message: "No valid access token found for this shop"
                };
                return;
            }

            const [{ allProductCategories }, shopInfo] = await Promise.all([
                getShopData(domain, accessToken),
                getShopProperties(domain, accessToken)
            ]);

            const shopData = { ...shopInfo, allProductCategories };

            if (shopData) {
                await ShopDetailService.createOrUpdateShopDetail({ ...shopData });
            }

            if (shop.hashSolution || shop.hashPortal) {
                const orderAccessToken = shop.hashSolution ?
                    Buffer.from(shop.hashSolution, 'base64').toString('utf-8') :
                    Buffer.from(shop.hashPortal, 'base64').toString('utf-8');

                const orders = await getOrders(domain, orderAccessToken);

                if (orders && orders.length > 0) {
                    await ListOrdersService.updateCurrencyCode(domain, orders);
                }
            }

            ctx.body = {
                success: true,
                message: "Shop detail updated successfully"
            };

            console.info({level: "info", location: "controllers/store-data/updateShopDetail", message: `${domain}`});
        } catch (error) {
            ctx.status = 500;
            ctx.body = {
                success: false,
                message: "Shop detail update failed",
            }
        }
    },

    getIgnoreNicknames: async (ctx) => {
        try {
            const ignoreNicknames = await IgnoreNicknameService.find();
            ctx.body = {
                message: "success",
                data: ignoreNicknames.map(item => item.domain)
            }   
        } catch (error) {
            ctx.status = 500;
            ctx.body = {
                message: "error",
                data: error
            }
        }
    },

    putIgnoreNicknames: async (ctx) => {
        const { ignoreNicknames } = ctx.request.body;
        try {
            if (!ignoreNicknames || !Array.isArray(ignoreNicknames)) {
                ctx.status = 400;
                ctx.body = {
                    message: "error",
                    data: "Invalid input"
                }
                return;
            }

            await IgnoreNicknameService.purge();
            await IgnoreNicknameService.createMany(ignoreNicknames.map(nickname => ({ domain: nickname })));
            ctx.body = {
                message: "success",
                data: ignoreNicknames
            }
        } catch (error) {
            console.error(error);
            ctx.status = 500;
            ctx.body = {
                message: "error",
                data: error
            }
        }
    },

    getShopData: async (ctx) => {
        const { domain } = ctx.query;
        try {
            const [shop, installedApps, orderStats] = await Promise.all([
                ShopDetailService.findShopDetail(domain),
                ShopService.getAppInstalled(domain),
                ListOrdersService.getOrderStatistics(domain)
            ]);

            const shopData = shop ? JSON.parse(JSON.stringify(shop)) : null;

            let storeCountInSameCountry = null;
            let categoryStats = null;

            if (shopData) {
                if (shopData?.country) {
                    storeCountInSameCountry = await ShopDetailService.countStoresByCountry(shopData.country);
                }

                if (shopData.productCategories && shopData.productCategories.length > 0) {
                    categoryStats = await ShopDetailService.getCategoryStoreStats(shopData.productCategories);
                }
            }

            ctx.body = {
                success: true,
                message: "success",
                data: shopData ? {
                    ...shopData,
                    apps: installedApps,
                    storeCountInSameCountry: storeCountInSameCountry,
                    categoryStoreStats: categoryStats,
                    orderStatistics: orderStats
                } : null
            }
        } catch (error) {
            ctx.status = 500;
            ctx.body = {
                success: false,
                message: "error",
                data: null
            }
        }
    },
}