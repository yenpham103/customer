const Router = require('koa-router');
const { getRoles } = require('../controllers/roles');

const Roles = new Router({ prefix: '/roles' });

Roles.get('/', getRoles);

module.exports = Roles;