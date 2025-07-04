const Router = require('koa-router');
const { getUserByEmail, createUser, updateUserLastLogin } = require('../controllers/auth');

const Auth = new Router({ prefix: '/auth' });

Auth.get('/users/:email', getUserByEmail);      
Auth.post('/users', createUser);                  
Auth.patch('/users/:userId/last-login', updateUserLastLogin);

module.exports = Auth;