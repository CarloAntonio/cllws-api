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
router.get('/getFriends/:id', isAuth, friendController.getFriendsPublic);
router.patch('/addRequest', isAuth, friendController.addRequest);
router.patch('/friendRequestOutcome', isAuth, friendController.friendRequestOutcome);

// export router
module.exports = router;