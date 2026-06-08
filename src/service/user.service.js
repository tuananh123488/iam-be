const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
class UserService {
    getAll = async () => {
        return await userModel.find();
    }
    deleteUser = async (userId) => {
        return await userModel.findByIdAndDelete(userId);
    }
    findByPhone = async (phone) => {
        return await userModel.findOne({ phone });
    }
    update = async (user) => {
        const userUpdated = await userModel.findByIdAndUpdate(user._id, user, { new: true })
        return userUpdated
    }
}

module.exports = new UserService();

