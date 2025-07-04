const Router = require('koa-router');
const {
    getPermissions,
    getPermissionByRole,
    createPermission,
    updatePermission,
    deletePermission,
    batchUpdatePermissions
} = require('../controllers/permissions');
const { extractUserEmail, requireRoot } = require('../middlewares/auth');

const Permissions = new Router({ prefix: '/permissions' });

Permissions.use(extractUserEmail);

Permissions.get('/', getPermissions);
Permissions.get('/:role', getPermissionByRole);
Permissions.post('/', requireRoot, createPermission);
Permissions.put('/:role', requireRoot, updatePermission);
Permissions.delete('/:role', requireRoot, deletePermission);
Permissions.patch('/batch', requireRoot, batchUpdatePermissions);

module.exports = Permissions;