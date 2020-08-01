// libraries
const express = require('express');
const { body } = require('express-validator');

// middleswares
const isAuth = require('../middlewares/is-auth');

// controllers
const feedController = require('../controllers/feed');

// create router
const router = express.Router();

// routes
router.get('/getFeed/:queryString', isAuth, feedController.getFeed);

// export router
module.exports = router;