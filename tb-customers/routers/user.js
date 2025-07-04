const Router = require('koa-router');
const { getUsers, getUserById, updateUserRole, deleteUser } = require('../controllers/user');
const { extractUserEmail, requireRoot } = require('../middlewares/auth');

const Users = new Router({ prefix: '/users' });

Users.use(extractUserEmail);

Users.get('/', getUsers);                        
Users.get('/:userId', getUserById);                
Users.patch('/:userId/role', requireRoot, updateUserRole); 
Users.delete('/:userId', requireRoot, deleteUser); 

module.exports = Users;