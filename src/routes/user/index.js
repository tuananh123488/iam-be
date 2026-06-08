const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const roleMiddleware = require('../../middleware/role.middleware');


router.put('/:id', userController.update);
router.delete('/:id', userController.delete);
router.get('/findByPhone', userController.findByPhone);
router.get('/getAll', userController.getAll);
module.exports = router;
