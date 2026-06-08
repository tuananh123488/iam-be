'use strict'
const jwt = require('jsonwebtoken');

const AuthService = require('../service/auth.service');

const authMiddleware = async (req, res, next) => {
    try {
        const accessToken = req.headers['accesstoken'] || (req.headers['authorization'] ? req.headers['authorization'].split(' ')[1] : null);
        const refreshToken = req.headers['refreshtoken'];


        if (!accessToken || !refreshToken) {
            return res.status(401).json({ message: 'Missing Information' });
        }

        jwt.verify(accessToken, process.env.JWT_SECRET || 'tuananh2506', (err, decodedAccessToken) => {
            if (err) {
                // Access token expired or invalid, check refresh token
                jwt.verify(refreshToken, process.env.JWT_SECRET || 'tuananh2506', async (error, decodedRefresh) => {
                    if (error) {
                        return res.status(401).json({ message: 'Tokens Expired' });
                    }

                    // Refresh token is valid, generate new tokens
                    const { userId, email, role } = decodedRefresh;

                    const newTokens = await AuthService.generateTokens({ userId, email, role });

                    req.userId = userId;
                    req.userRole = role;
                    req.user = { userId, email, role };
                    req.tokens = newTokens;

                    // Set new tokens in response headers for the client
                    res.setHeader('x-new-access-token', newTokens.accessToken);
                    res.setHeader('x-new-refresh-token', newTokens.refreshToken);

                    next();
                });
            } else {
                // Access token is valid
                const { userId, email, role } = decodedAccessToken;
                req.userId = userId;
                req.userRole = role;
                req.user = { userId, email, role };
                req.tokens = { accessToken, refreshToken };
                next();
            }
        });
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = authMiddleware;
