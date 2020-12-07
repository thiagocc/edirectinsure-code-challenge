const Users = require('../models/user');

const checkExistingUser = (email) => {
    return Users.findOne({ email: email }).lean().exec();
};

exports.checkExistingUser = checkExistingUser;
