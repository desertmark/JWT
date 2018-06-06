const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/test');

const User = mongoose.model('User',new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
}))

module.exports = User;