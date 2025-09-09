const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userCtrl = require('../controller/userController');

router.get('/', auth, userCtrl.list);

module.exports = router;
