const { UserService } = require("../services");

const getUserByEmail = async (ctx) => {
    try {
        const { email } = ctx.params;
        
        if (!email) {
            ctx.status = 400;
            ctx.body = { 
                success: false,
                error: 'Email is required' 
            };
            return;
        }

        const { user, permissions } = await UserService.getUserWithPermissions(email);

        ctx.status = 200;
        ctx.body = {
            success: true,
            data: {
                user,
                permissions
            }
        };
    } catch (error) {
        console.error('Get user by email error:', error);
        ctx.status = 500;
        ctx.body = { 
            success: false,
            error: 'Internal server error' 
        };
    }
};

const createUser = async (ctx) => {
    try {
        const userData = ctx.request.body;
        
        if (!userData.email || !userData.name) {
            ctx.status = 400;
            ctx.body = { 
                success: false,
                error: 'Email and name are required' 
            };
            return;
        }

        const existingUser = await UserService.findUserByEmail(userData.email);
        if (existingUser) {
            ctx.status = 409;
            ctx.body = { 
                success: false,
                error: 'User already exists' 
            };
            return;
        }

        const user = await UserService.createUser(userData);

        ctx.status = 201;
        ctx.body = { 
            success: true,
            data: { user },
            message: 'User created successfully'
        };
    } catch (error) {
        console.error('Create user error:', error);
        ctx.status = 500;
        ctx.body = { 
            success: false,
            error: 'Internal server error' 
        };
    }
};

const updateUserLastLogin = async (ctx) => {
    try {
        const { userId } = ctx.params;
        
        await UserService.updateUserLastLogin(userId);

        ctx.status = 200;
        ctx.body = { 
            success: true,
            message: 'Last login updated successfully' 
        };
    } catch (error) {
        console.error('Update last login error:', error);
        ctx.status = 500;
        ctx.body = { 
            success: false,
            error: 'Internal server error' 
        };
    }
};

module.exports = {
    getUserByEmail,
    createUser,
    updateUserLastLogin
};