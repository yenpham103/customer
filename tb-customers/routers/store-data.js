const Router = require('koa-router');

const { getIgnoreNicknames, putIgnoreNicknames, processAppEvent, getShopData, updateShopDetail } = require('../controllers/store-data');
const { verifyBotRequest } = require('../middlewares/verifyBotRequest');

const StoreData = new Router({ prefix: '/store-data' });

StoreData.get('/ignores', (ctx) => getIgnoreNicknames(ctx));
StoreData.put('/ignores', (ctx) => putIgnoreNicknames(ctx));
StoreData.post('/app-event', verifyBotRequest, (ctx) => processAppEvent(ctx));
StoreData.put('/shop', (ctx) => updateShopDetail(ctx));
StoreData.get('/shop', (ctx) => getShopData(ctx));
    
module.exports = StoreData;