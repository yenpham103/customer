const combineRouters = require("koa-combine-routers");

const router = combineRouters(
    require("./crisp"),
    require("./store-data"),
    require("./user"),
    require("./auth"),
    require("./roles"),
    require("./permissions")
);

module.exports = router;