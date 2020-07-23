const express = require('express');
const { body } = require('express-validator');

const User = require('../models/user');
const authController = require('../controllers/auth');

const isAuth = require('../middlewares/is-auth');

const router = express.Router();

router.put(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('E-Mail address already exists!');
          }
        });
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 5 })
      .withMessage('Password must be atleast five characters long.'),
    body('confirmPassword')
      .trim()
      .isLength({ min: 5 })
      .withMessage('Password must be atleast five characters long.'),
    body('username')
      .trim()
      .isLength({ min: 2 })
      .withMessage('username must be atleast 2 characters long.')
  ],
  authController.signup
);

router.post(
    '/login', 
    [
        body('email')
          .isEmail()
          .withMessage('Please enter a valid email.')
          .normalizeEmail(),
        body('password')
          .trim()
          .isLength({ min: 5 }),
      ],
    authController.login
);

router.get(
  '/getUserDetails', 
  isAuth,
  authController.getUserDetails
);

module.exports = router;