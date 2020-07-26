// libraries
const express = require('express');
const { body } = require('express-validator');

// middleswares
const isAuth = require('../middlewares/is-auth');

// controllers
const postController = require('../controllers/post');

// create router
const router = express.Router();

// routes
router.post(
    '/addPost', 
    isAuth, 
    // [
    //     body('text')
    //         .trim()
    //         .not()
    //         .isEmpty()
    //         .withMessage('Input is Required')
    // ],
    postController.addPost
);
router.get('/getPosts', isAuth, postController.getPosts);
router.get('/getPosts/:username', isAuth, postController.getPostsPublic);

// export router
module.exports = router;