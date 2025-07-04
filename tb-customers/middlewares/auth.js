const { UserService } = require("../services");

const extractUserEmail = async (ctx, next) => {
    try {
        const userEmail = ctx.request.headers['x-user-email'];
        const userName = ctx.request.headers['x-user-name'];
        const userRole = ctx.request.headers['x-user-role'];
        
        if (userEmail) {
            ctx.state.userEmail = userEmail;
            ctx.state.userName = userName;
            ctx.state.userRole = userRole;
        } else {
            console.warn('⚠️ Auth middleware - No user email found in headers');
        }
    } catch (error) {
        console.error('❌ Auth middleware error:', error);
    }

    await next();
};

const requireRoot = async (ctx, next) => {
    const userEmail = ctx.state.userEmail;

    if (!UserService.isRootUser(userEmail)) {
        ctx.status = 403;
        ctx.body = {
            success: false,
            error: 'Root access required'
        };
        return;
    }

    await next();
};

module.exports = {
    extractUserEmail,
    requireRoot
};