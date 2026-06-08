const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // required bat buoc co 
    username: { type: String, required: true },
    email: { type: String, unique: true, default: "" },
    password: { type: String, required: true },
    role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
    phone: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now }

});
const User = mongoose.model('User', userSchema);

module.exports = User;