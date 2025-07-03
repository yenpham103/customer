const Shop = require("../entities/general/shop");

class ShopService {
    static createOrUpdate = async function ({ domain, app, hash }) {
        const updateShop = { domain }

        if (app === "lock") {
            updateShop.hashLock = hash;
        } else if (app === "solution") {
            updateShop.hashSolution = hash;
        } else if (app === "portal") {
            updateShop.hashPortal = hash;
        }

        const shop = await Shop.findOneAndUpdate({ domain }, updateShop, { upsert: true, new: true }).exec();
        return shop;
    }

    static removeHash = async function ({ domain, app }) {
        const updateShop = {}

        if (app === "lock") {
            updateShop.hashLock = null;
        } else if (app === "solution") {
            updateShop.hashSolution = null;
        } else if (app === "portal") {
            updateShop.hashPortal = null;
        }

        const shop = await Shop.findOneAndUpdate({ domain }, updateShop, { new: true }).exec();
        return shop;
    }

    static getAppInstalled = async function (domain) {
        const shop = await Shop.findOne({ domain }).exec();
        
        if (!shop) return [];

        const appInstalled = [];

        if (shop.hashLock) {
            appInstalled.push("lock");
        }
        if (shop.hashSolution) {
            appInstalled.push("solution");
        }
        if (shop.hashPortal) {
            appInstalled.push("portal");
        }

        return appInstalled;
    }

    static findShopByDomain = async function (domain) {
        const shop = await Shop.findOne({ domain }).exec();
        return shop;
    }
}

module.exports = ShopService