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
router.post('/updateProfilePic', isAuth, profileController.updateProfilePic);
// router.post('/updateUser', userController.updateUserData);
// router.post('/checkUsername', userController.checkUsername);
// router.post('/updateUsername', userController.updateUsername);

// router.post('/getOtherUserData', userController.getOtherUserData);

// export router
module.exports = router;