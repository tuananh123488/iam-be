const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
class AuthService {
    signUp = async ({ username, email, password, phone }) => {
        const existingEmail = await userModel.findOne({ email });
        if (existingEmail) {
            throw new Error('Email đã tồn tại');
        }

        const existingPhone = await userModel.findOne({ phone });
        if (existingPhone) {
            throw new Error('Số điện thoại đã tồn tại');
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({
            username,
            email,
            password: passwordHash,
            phone
        });
        return newUser;
    }

    generateTokens = async (payload) => {
        const accessToken = jwt.sign(
            payload,
            process.env.JWT_SECRET || 'your_jwt_secret_key_here',
            { expiresIn: '1h' }
        );

        const refreshToken = jwt.sign(
            payload,
            process.env.JWT_SECRET || 'your_jwt_refresh_secret_key_here',
            { expiresIn: '7d' }
        );

        return { accessToken, refreshToken };
    }

    logIn = async ({ email, password }) => {
        const user = await userModel.findOne({ email });

        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            throw new Error('Invalid password');
        }

        const tokens = await this.generateTokens({
            userId: user._id,
            email: user.email,
            role: user.role
        });

        return { user, ...tokens };
    }

    getByID = async (userId) => {
        return await userModel.findById(userId).select('-password');
    }
}
module.exports = new AuthService();