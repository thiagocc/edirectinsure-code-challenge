const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    email: {
        type: String,
        index: true,
        unique: true,
    },
    password: String,
    isAdmin: { type: Boolean, default: false },

    createdAt: { type: Date, default: Date.now },
    lastLoginAt: { type: Date, default: Date.now },
    lastUpdatedAt: { type: Date, default: Date.now },

    status: { type: Number, default: 1 },
});

UserSchema.pre('save', function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
    }

    next();
});

UserSchema.methods.isValidPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
