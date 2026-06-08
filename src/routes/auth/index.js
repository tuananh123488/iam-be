const express = require('express');
const router = express.Router();
const AuthController = require('../../controllers/auth.controller');
const authMiddleware = require('../../middleware/auth.middleware');

router.post('/signup', AuthController.signUp);
router.post('/login', AuthController.logIn);
router.get('/getByID', authMiddleware, AuthController.getByID);


module.exports = router;
