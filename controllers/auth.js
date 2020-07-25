
// libraries
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// models
const User = require('../models/user');
const Profile = require('../models/profile');

// keys
const { HashSecret } = require('../keys/bcryptKeys');

exports.signup = (req, res, next) => {
  // check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      let error = null;
      if(errors.errors[0].msg) {
          error = new Error(errors.errors[0].msg)
          error.statusCode = 401;
          throw error;
      } else {
          error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
      }
  }
  
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if(password !== confirmPassword){
      const error = new Error('Passwords Do Not Match');
      error.statusCode = 401;
      throw error;
  }

  let user = null;
  let token = null;

  bcrypt
    .hash(password, 12)
    .then(hashedPw => {
      user = new User({
        email: email,
        password: hashedPw,
        username: username
      });
      return user.save();
    })
    .then(result => {
        token = jwt.sign(
            {
              email: result.email,
              userId: result._id
            },
            HashSecret,
            { expiresIn: '1h' }
        );
        
        const profile = new Profile({
            user: result._id
        })

        return profile.save();
    })
    .then(profile => {
        user.profile = profile._id
        return user.save()
    })
    .then(result => {
        res.status(201).json({ 
            message: 'User created!', 
            token: token
        });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
    // check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let error = null;
        if(errors.errors[0].msg) {
            error = new Error(errors.errors[0].msg)
            error.statusCode = 401;
            throw error;
        } else {
            error = new Error('Validation failed.');
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }
    }

    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                const error = new Error('Incorrect Email Or Password');
                error.statusCode = 401;
                throw error;
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('Incorrect Email Or Password');
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign(
                {
                    email: loadedUser.email,
                    userId: loadedUser._id.toString(),
                },
                HashSecret,
                { expiresIn: '1h' }
            );
            res.status(200).json({ 
                token: token,
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
        next(err);
    });
};
