const verifyBotRequest = async (ctx, next) => {
    const botAuthHeader = ctx.headers.authorization;
    const botKeyHeader = ctx.headers['x-bot-request'];
    
    if (!botAuthHeader || !botAuthHeader.startsWith('Bearer ')) {
        ctx.status = 401;
        ctx.body = { message: "Unauthorized: Missing Authorization Header" };
        return;
    }
    
    const botApiKey = botAuthHeader.replace('Bearer ', '');
    if (botApiKey !== process.env.TB_CUSTOMER_BOT_TOKEN) {
        ctx.status = 401;
        ctx.body = { message: "Unauthorized: Invalid API Key" };
        return;
    }
    
    if (botKeyHeader !== 'mechabee') {
        ctx.status = 401;
        ctx.body = { message: "Unauthorized: Invalid Bot Key" };
        return;
    }
    
    await next();
};

module.exports = {
    verifyBotRequest
};