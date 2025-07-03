const Router = require('koa-router');
const { getOperators, syncOperators, getConversations, deleteConversation } = require('../controllers/crisp');

const Crisp = new Router({ prefix: '/crisp' });

Crisp.get('/operators', (ctx) => getOperators(ctx));
Crisp.post('/operators/sync', (ctx) => syncOperators(ctx));

Crisp.get('/conversations', (ctx) => getConversations(ctx));
Crisp.delete('/conversations/:conversationId', (ctx) => deleteConversation(ctx));

module.exports = Crisp;