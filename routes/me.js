const express = require('express');
const MeController = require('../controllers/meController');
const checkLoggedIn = require('../middleware/checkLoginStatus');
const router = express.Router();

router.get('/profile', checkLoggedIn, MeController.getProfile);

module.exports = router;
