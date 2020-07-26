const express = require('express');
const { body } = require('express-validator');

const userController = require('../controllers/user');

// custom middlewares
const isAuth = require('../middlewares/is-auth');
const multer = require('../middlewares/multer');

const router = express.Router();

router.get('/getUser', isAuth, userController.getUser);
router.get('/getUser/:username', isAuth, userController.getUserPublic);
router.patch('/updateUser', isAuth, userController.updateUser);
router.patch('/updateUserPic', isAuth, multer.single('pic'), userController.updateUserPic);
// router.post('/completeOnBoarding', isAuth, userController.completeOnBoarding);

module.exports = router;