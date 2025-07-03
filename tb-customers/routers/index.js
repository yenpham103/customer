const combineRouters = require("koa-combine-routers");

const router = combineRouters(
    require("./crisp"),
    require("./store-data"),
);

module.exports = router;