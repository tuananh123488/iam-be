'use strict'
const UserService = require('../service/user.service');

class UserController {

    getAll = async (req, res) => {
        try {
            const user = await UserService.getAll()
            if (!user) return res.status(404).json({ message: 'User not found' });
            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    update = async (req, res) => {
        try {
            const user = await UserService.update({ _id: req.params.id, ...req.body });
            if (!user) return res.status(404).json({ message: 'User not found' });
            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };
    findByPhone = async (req, res) => {
        try {
            const { phone } = req.query;
            const user = await UserService.findByPhone(phone);
            if (!user) return res.status(404).json({ message: 'User not found' });
            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    delete = async (req, res) => {
        try {
            const user = await UserService.deleteUser(req.params.id);
            if (!user) return res.status(404).json({ message: 'User not found' });
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
}

module.exports = new UserController();
