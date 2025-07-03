// Write koa application boostrap using koa, koa-router, koa-body, koa-cors
require("dotenv").config();
const Koa = require('koa');
const { koaBody } = require('koa-body');
const KoaCors = require('@koa/cors');
const KoaStatic = require('koa-static');
const router = require('./routers');


const server = new Koa();

server.use(KoaCors({
    origin: process.env.ADMIN_URL,
    credentials: true,
    allowMethods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
    allowHeaders: [
        "DNT",
        "User-Agent",
        "X-Requested-With",
        "If-Modified-Since",
        "Cache-Control",
        "Content-Type",
        "Range",
        "authentication",
        "x-hmac-sign",
        "authorization",
        "x-bot-request"
    ],

}));
server.use(KoaStatic('./public'));
server.use(koaBody({
    jsonLimit: '1mb',
    formLimit: '1mb',
}));
server.use(router());
server.listen(process.env.PORT, async () => {
    if (!process.env.CRISP_TOKEN) {
        console.error({ level: "error", location: "index.js", message: "CRISP_TOKEN is not provided" });
    }
    if (!process.env.MONGO_URI) {
        console.error({ level: "error", location: "index.js", message: "MONGO_URI is not provided" });
    }
    if (!process.env.PORT) {
        console.error({ level: "error", location: "index.js", message: "PORT is not provided" });
    }
    if (!process.env.ADMIN_URL) {
        console.error({ level: "error", location: "index.js", message: "ADMIN_URL is not provided" });
    }
    if (
        process.env.CRISP_TOKEN
        && process.env.MONGO_URI
        && process.env.PORT
        && process.env.ADMIN_URL
        && process.env.TB_CUSTOMER_BOT_TOKEN
    ) {
        await require('./bootstrap/database')();
        // require('./bootstrap/fetchActiveVisitors')();
        // require('./bootstrap/fetchConversationOperator')();
    }
    console.log('Server is running on port', process.env.PORT);
});