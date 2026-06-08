const AuthService = require('../service/auth.service');
class AuthController {


    getByID = async (req, res) => {
        try {

            const user = await AuthService.getByID(req.userId);

            if (!user) return res.status(404).json({ message: 'User not found' });
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    signUp = async (req, res) => {
        try {
            const user = await AuthService.signUp(req.body);
            res.status(201).json({
                message: 'User created successfully',
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    phone: user.phone,
                    role: user.role
                }
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    logIn = async (req, res) => {
        try {

            const { user, accessToken, refreshToken } = await AuthService.logIn(req.body);

            res.status(200).json({
                message: 'Login successful',
                accessToken,
                refreshToken,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    phone: user.phone,
                    role: user.role
                }
            });
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    };


}
module.exports = new AuthController();
