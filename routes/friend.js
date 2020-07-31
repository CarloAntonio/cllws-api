// libraries
const express = require('express');
const { body } = require('express-validator');

// middleswares
const isAuth = require('../middlewares/is-auth');

// controllers
const friendController = require('../controllers/friend');

// create router
const router = express.Router();

// routes
router.get('/getFriends', isAuth, friendController.getFriends);
router.patch('/addRequest', isAuth, friendController.addRequest);
// router.get('/getFriends/:uid', isAuth, friendController.)

// export router
module.exports = router;