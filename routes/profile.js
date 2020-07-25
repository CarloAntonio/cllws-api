// libraries
const express = require('express');
const { body } = require('express-validator');

// middleswares
const isAuth = require('../middlewares/is-auth');

// controllers
const profileController = require('../controllers/profile');

// create router
const router = express.Router();

// routes
router.get('/getBasicInfo', isAuth, profileController.getBasicInfo);
router.post('/updateBasicInfo', isAuth, profileController.updateBasicInfo);

// export router
module.exports = router;