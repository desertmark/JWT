const bcrypt = require('bcryptjs');
const User = require('./user.js');

function createUser(user) {
    return bcrypt.genSalt(10).then(salt => {
        return bcrypt.hash(user.password, salt).then(hash => {
            user.password = hash;
            return User.create(user);
        });
    })
    .catch(console.error);
}

function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
}

module.exports = {
    createUser,
    comparePassword,
}