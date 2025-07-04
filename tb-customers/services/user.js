const User = require('../entities/admin/user');
const Permission = require('../entities/admin/permission');

class UserService {
    static isRootUser = function (email) {
        return email?.toLowerCase() === 'yenpx@bsscommerce.com';
    }

    static findUserByEmail = function (email) {
        return User.findOne({
            email: email.toLowerCase(),
            isActive: true
        }).lean({ getters: true });
    }

    static createUser = function (userData) {
        const user = new User({
            email: userData.email.toLowerCase(),
            name: userData.name,
            avatar: userData.avatar,
            role: this.isRootUser(userData.email) ? 'root' : null,
            lastLoginAt: new Date()
        });

        return user.save();
    }

    static updateUserLastLogin = function (userId) {
        return User.findByIdAndUpdate(userId, {
            lastLoginAt: new Date()
        });
    }

    static getAllUsers = async function (page = 1, limit = 10, filters = {}) {
        const query = { isActive: true };

        // Apply filters
        if (filters.role && filters.role !== 'all') {
            query.role = filters.role;
        }
        if (filters.search) {
            query.$or = [
                { name: { $regex: filters.search, $options: 'i' } },
                { email: { $regex: filters.search, $options: 'i' } }
            ];
        }

        const users = await User.find(query)
            .sort({
                role: { $eq: 'root' } ? -1 : 1,
                createdAt: -1
            })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean({ getters: true });

        const total = await User.countDocuments(query);

        return {
            users,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }

    static assignUserRole = async function (userId, role, currentUserEmail) {
        if (!this.isRootUser(currentUserEmail)) {
            throw new Error('Only root user can assign roles');
        }

        if (role === 'root') {
            throw new Error('Cannot assign root role to other users');
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        if (this.isRootUser(user.email)) {
            throw new Error('Cannot modify root user role');
        }

        return User.findByIdAndUpdate(userId, {
            role
        }, { new: true }).lean({ getters: true });
    }

    static deleteUser = async function (userId, currentUserEmail) {
        if (!this.isRootUser(currentUserEmail)) {
            throw new Error('Only root user can delete users');
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        if (this.isRootUser(user.email)) {
            throw new Error('Cannot delete root user');
        }

        return User.findByIdAndUpdate(userId, {
            isActive: false
        });
    }

    static getUserWithPermissions = async function (email) {
        const user = await this.findUserByEmail(email);
        if (!user || !user.role) {
            return { user, permissions: null };
        }

        if (user.role === 'root') {
            const rootPermissions = {
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
            return { user, permissions: rootPermissions };
        }

        const permissions = await Permission.findOne({
            role: user.role,
            isActive: true
        }).lean({ getters: true });

        return { user, permissions };
    }
}

module.exports = UserService;