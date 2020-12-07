const Users = require('../models/user');

const user = new Users({
    name: 'Admin',
    email: 'admin@admin.com',
    password: '123456',
    isAdmin: true,
});

user.save()
    .then(() => {})
    .catch(() => {});
