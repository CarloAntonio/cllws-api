const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { HashSecret } = require('../keys/bcryptKeys');

exports.signup = (req, res, next) => {
  // check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      console.log(errors);
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

  bcrypt
    .hash(password, 12)
    .then(hashedPw => {
      const user = new User({
        email: email,
        password: hashedPw,
        username: username
      });
      return user.save();
    })
    .then(result => {
        const token = jwt.sign(
            {
              email: result.email,
              userId: result._id
            },
            HashSecret,
            { expiresIn: '1h' }
        );
        
        res.status(201).json({ 
            message: 'User created!', 
            token: token, 
            username: username,
            uid: result._id 
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
            res.status(200).json({ token: token, username: loadedUser.username, uid: loadedUser._id.toString() });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
        next(err);
    });
};

exports.getUserDetails = (req, res, next) => {
    User.findById(req.uid)
        .then(user => {
            if (!user) {
                const error = new Error('Could not find user.');
                error.statusCode = 404;
                throw error;
            }

            res.status(200).json({ 
                uid: user._id.toString(), 
                email: user.email ? user.email : null,
                username: user.username ? user.username : null,
                pic: user.pic ? user.pic : null,
                firstName: user.firstName ? user.firstName : null,
                lastName: user.lastName ? user.lastName : null
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });    
}
