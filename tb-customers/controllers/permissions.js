const { PermissionService } = require("../services");

const getPermissions = async (ctx) => {
    try {
        const permissions = await PermissionService.getAllPermissions();

        ctx.status = 200;
        ctx.body = {
            success: true,
            data: permissions
        };
    } catch (error) {
        console.error('Get permissions error:', error);
        ctx.status = 500;
        ctx.body = {
            success: false,
            error: 'Internal server error'
        };
    }
};

// GET /permissions/:role - Get permission by role
const getPermissionByRole = async (ctx) => {
    try {
        const { role } = ctx.params;

        const permission = await PermissionService.getPermissionsByRole(role);

        if (!permission) {
            ctx.status = 404;
            ctx.body = {
                success: false,
                error: 'Permission not found'
            };
            return;
        }

        ctx.status = 200;
        ctx.body = {
            success: true,
            data: permission
        };
    } catch (error) {
        console.error('Get permission by role error:', error);
        ctx.status = 500;
        ctx.body = {
            success: false,
            error: 'Internal server error'
        };
    }
};

// POST /permissions - Create new permission (Root only)
const createPermission = async (ctx) => {
    try {
        const permissionData = ctx.request.body;
        const currentUserEmail = ctx.state.userEmail; // Từ auth middleware

        if (!permissionData.role) {
            ctx.status = 400;
            ctx.body = {
                success: false,
                error: 'Role is required'
            };
            return;
        }

        const permission = await PermissionService.createOrUpdatePermission(
            permissionData.role,
            permissionData,
            currentUserEmail
        );

        ctx.status = 201;
        ctx.body = {
            success: true,
            data: { permission },
            message: 'Permission created successfully'
        };
    } catch (error) {
        console.error('Create permission error:', error);

        if (error.message.includes('Only root user') || error.message.includes('Cannot modify')) {
            ctx.status = 403;
        } else {
            ctx.status = 500;
        }

        ctx.body = {
            success: false,
            error: error.message || 'Internal server error'
        };
    }
};

// PUT /permissions/:role - Update permission (Root only)
const updatePermission = async (ctx) => {
    try {
        const { role } = ctx.params;
        const permissionData = ctx.request.body;
        const currentUserEmail = ctx.state.userEmail; // Từ auth middleware

        const permission = await PermissionService.createOrUpdatePermission(
            role,
            permissionData,
            currentUserEmail
        );

        ctx.status = 200;
        ctx.body = {
            success: true,
            data: { permission },
            message: 'Permission updated successfully'
        };
    } catch (error) {
        console.error('Update permission error:', error);

        if (error.message.includes('Only root user') || error.message.includes('Cannot modify')) {
            ctx.status = 403;
        } else {
            ctx.status = 500;
        }

        ctx.body = {
            success: false,
            error: error.message || 'Internal server error'
        };
    }
};

// DELETE /permissions/:role - Delete permission (Root only)
const deletePermission = async (ctx) => {
    try {
        const { role } = ctx.params;
        const currentUserEmail = ctx.state.userEmail; // Từ auth middleware

        await PermissionService.deletePermission(role, currentUserEmail);

        ctx.status = 200;
        ctx.body = {
            success: true,
            message: 'Permission deleted successfully'
        };
    } catch (error) {
        console.error('Delete permission error:', error);

        if (error.message.includes('Only root user') || error.message.includes('Cannot delete')) {
            ctx.status = 403;
        } else {
            ctx.status = 500;
        }

        ctx.body = {
            success: false,
            error: error.message || 'Internal server error'
        };
    }
};

// PATCH /permissions/batch - Batch update permissions (Root only)
const batchUpdatePermissions = async (ctx) => {
    try {
        const permissionsData = ctx.request.body;
        const currentUserEmail = ctx.state.userEmail; // Từ auth middleware

        const results = await PermissionService.batchUpdatePermissions(permissionsData, currentUserEmail);

        ctx.status = 200;
        ctx.body = {
            success: true,
            data: { permissions: results },
            message: 'Permissions updated successfully'
        };
    } catch (error) {
        console.error('Batch update permissions error:', error);

        if (error.message.includes('Only root user') || error.message.includes('Cannot modify')) {
            ctx.status = 403;
        } else {
            ctx.status = 500;
        }

        ctx.body = {
            success: false,
            error: error.message || 'Internal server error'
        };
    }
};

module.exports = {
    getPermissions,
    getPermissionByRole,
    createPermission,
    updatePermission,
    deletePermission,
    batchUpdatePermissions
};