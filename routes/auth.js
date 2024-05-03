const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/sign-in', authController.signInUser);
router.post('/sign-out', authController.signOutUser);
router.get('/sign-in-status', authController.getSignInStatus);

module.exports = router;
