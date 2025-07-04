const { PermissionService } = require("../services");

const getRoles = async (ctx) => {
    try {
        const roles = await PermissionService.getAllRoles();
        
        ctx.status = 200;
        ctx.body = {
            success: true,
            data: roles
        };
    } catch (error) {
        console.error('Get roles error:', error);
        ctx.status = 500;
        ctx.body = { 
            success: false,
            error: 'Internal server error' 
        };
    }
};

module.exports = {
    getRoles
};