const express = require('express');
const UserController = require('../controllers/userController');
const router = express.Router();

router.post('/', UserController.createUser);
router.delete('/:userId', UserController.deleteUser);

module.exports = router;
