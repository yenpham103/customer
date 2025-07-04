const Permission = require('../entities/admin/permission');
const User = require('../entities/admin/user');

class PermissionService {
    static isRootUser = function (email) {
        return email?.toLowerCase() === 'yenpx@bsscommerce.com';
    }

    static getAllPermissions = function () {
        return Permission.find({ isActive: true })
            .sort({ role: 1 })
            .lean({ getters: true });
    }

    static getPermissionsByRole = function (roleName) {
        if (roleName === 'root') {
            return {
                role: 'root',
                dashboardGuest: true,
                dashboardView: true,
                dashboardEdit: true,
                operatorsView: true,
                operatorsEdit: true,
                conversationsView: true,
                conversationsEdit: true,
                storeDataView: true,
                storeDataEdit: true,
                ignoredNicknamesView: true,
                ignoredNicknamesEdit: true,
                userAdministrationView: true,
                userAdministrationEdit: true,
                isActive: true
            };
        }

        return Permission.findOne({
            role: roleName,
            isActive: true
        }).lean({ getters: true });
    }

    // Create hoặc update permission (chỉ root được phép)
    static createOrUpdatePermission = async function (roleName, permissions, currentUserEmail) {
        // Chỉ root mới có quyền modify permissions
        if (!this.isRootUser(currentUserEmail)) {
            throw new Error('Only root user can modify permissions');
        }

        // Root không được update permissions
        if (roleName === 'root') {
            throw new Error('Cannot modify root permissions');
        }

        return Permission.findOneAndUpdate(
            { role: roleName },
            {
                role: roleName,
                ...permissions
            },
            {
                upsert: true,
                new: true
            }
        );
    }

    // Delete permission (chỉ root được phép)
    static deletePermission = async function (roleName, currentUserEmail) {
        // Chỉ root mới có quyền delete permissions
        if (!this.isRootUser(currentUserEmail)) {
            throw new Error('Only root user can delete permissions');
        }

        // Root không được delete
        if (roleName === 'root') {
            throw new Error('Cannot delete root role');
        }

        // Check if any users are using this role
        const usersWithRole = await User.countDocuments({ role: roleName, isActive: true });
        if (usersWithRole > 0) {
            throw new Error('Cannot delete role. Users are assigned to this role.');
        }

        return Permission.findOneAndUpdate(
            { role: roleName },
            { isActive: false }
        );
    }

    // Batch update permissions (chỉ root được phép)
    static batchUpdatePermissions = async function (permissionsData, currentUserEmail) {
        // Chỉ root mới có quyền batch update
        if (!this.isRootUser(currentUserEmail)) {
            throw new Error('Only root user can modify permissions');
        }

        const results = [];

        for (const [roleName, permissions] of Object.entries(permissionsData)) {
            // Skip root role
            if (roleName === 'root') {
                continue;
            }

            const updatedPermission = await this.createOrUpdatePermission(roleName, permissions, currentUserEmail);
            results.push(updatedPermission);
        }

        return results;
    }

    // Check permission helper
    static hasPermission = function (permissions, page, action) {
        if (!permissions) return false;

        const permissionKey = `${page}${action.charAt(0).toUpperCase() + action.slice(1)}`;
        return permissions[permissionKey] === true;
    }

    // Get available permissions (dynamic)
    static getAvailablePermissions = function () {
        const pages = ['dashboard', 'operators', 'conversations', 'storeData', 'ignoredNicknames', 'userAdministration'];
        const actions = ['View', 'Edit'];

        const permissions = [];

        // Special permission
        permissions.push('dashboardGuest');

        pages.forEach(page => {
            if (page === 'dashboard') {
                permissions.push('dashboardView', 'dashboardEdit');
            } else {
                actions.forEach(action => {
                    permissions.push(`${page}${action}`);
                });
            }
        });

        return permissions;
    }

    static getAllRoles = async function () {
        const [userRoles, permissionRoles] = await Promise.all([
            User.distinct('role', { role: { $ne: null }, isActive: true }),
            Permission.distinct('role', { isActive: true })
        ]);

        const allRoles = [...new Set([...userRoles, ...permissionRoles, 'root'])];
        return allRoles.filter(role => role !== null);
    }
}

module.exports = PermissionService;