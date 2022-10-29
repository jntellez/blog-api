const mongoose = require('mongoose')

const User = mongoose.model('User', {
    name: { type: String, require: true, minLength: 3 },
    lastname: { type: String, require: true, minLength: 3 },
    image: { type: String },
    email: { type: String, required: true, minLength: 5 },
    password: { type: String, required: true, minLength: 6 },
    salt: { type: String, required: true },
    role: { type: String, default: 'user' }
})

module.exports = User