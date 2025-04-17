const mongoose = require('mongoose');

const userModel = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phonenumber: {
        type: Number
    }
});

// Check if model already exists before compiling
const User = mongoose.models.User || mongoose.model('User', userModel);

module.exports = User;