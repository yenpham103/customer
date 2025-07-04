const { UserService } = require("../services");

const getUsers = async (ctx) => {
    try {
        const { page = 1, limit = 10, role, search } = ctx.query;

        const filters = {};
        if (role && role !== 'all') filters.role = role;
        if (search) filters.search = search;

        const result = await UserService.getAllUsers(
            parseInt(page),
            parseInt(limit),
            filters
        );

        ctx.status = 200;
        ctx.body = {
            success: true,
            data: result
        };
    } catch (error) {
        console.error('Get users error:', error);
        ctx.status = 500;
        ctx.body = {
            success: false,
            error: 'Internal server error'
        };
    }
};

// GET /users/:userId - Get single user by ID
const getUserById = async (ctx) => {
    try {
        const { userId } = ctx.params;

        const user = await User.findById(userId).lean({ getters: true });

        if (!user) {
            ctx.status = 404;
            ctx.body = {
                success: false,
                error: 'User not found'
            };
            return;
        }

        ctx.status = 200;
        ctx.body = {
            success: true,
            data: { user }
        };
    } catch (error) {
        console.error('Get user by ID error:', error);
        ctx.status = 500;
        ctx.body = {
            success: false,
            error: 'Internal server error'
        };
    }
};

// PATCH /users/:userId/role - Assign role to user (Root only)
const updateUserRole = async (ctx) => {
    try {
        const { userId } = ctx.params;
        const { role } = ctx.request.body;
        const currentUserEmail = ctx.state.userEmail;

        if (!role) {
            ctx.status = 400;
            ctx.body = {
                success: false,
                error: 'Role is required'
            };
            return;
        }

        const updatedUser = await UserService.assignUserRole(userId, role, currentUserEmail);

        ctx.status = 200;
        ctx.body = {
            success: true,
            data: { user: updatedUser },
            message: 'Role assigned successfully'
        };
    } catch (error) {
        console.error('Update user role error:', error);

        if (error.message.includes('Only root user') || error.message.includes('Cannot assign') || error.message.includes('Cannot modify')) {
            ctx.status = 403;
        } else if (error.message.includes('not found')) {
            ctx.status = 404;
        } else {
            ctx.status = 500;
        }

        ctx.body = {
            success: false,
            error: error.message || 'Internal server error'
        };
    }
};

// DELETE /users/:userId - Delete user (Root only)
const deleteUser = async (ctx) => {
    try {
        const { userId } = ctx.params;
        const currentUserEmail = ctx.state.userEmail; // Từ auth middleware

        await UserService.deleteUser(userId, currentUserEmail);

        ctx.status = 200;
        ctx.body = {
            success: true,
            message: 'User deleted successfully'
        };
    } catch (error) {
        console.error('Delete user error:', error);

        if (error.message.includes('Only root user') || error.message.includes('Cannot delete')) {
            ctx.status = 403;
        } else if (error.message.includes('not found')) {
            ctx.status = 404;
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
    getUsers,
    getUserById,
    updateUserRole,
    deleteUser
};