const express = require('express');
const router = express.Router();
const { login, signup, me } = require('../controller/authController');
const auth = require('../middleware/auth');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', auth, me);

module.exports = router;
