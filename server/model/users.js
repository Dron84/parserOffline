const mongoose = require('mongoose')
const users = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    premission: {
        type: String,
        default: 'user'
    }
})

module.exports = mongoose.model('users', users)