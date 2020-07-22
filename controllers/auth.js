const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
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
//   const name = req.body.name;
  const password = req.body.password;

  bcrypt
    .hash(password, 12)
    .then(hashedPw => {
      const user = new User({
        email: email,
        password: hashedPw,
        // name: name
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
                userId: loadedUser._id.toString()
                },
                HashSecret,
                { expiresIn: '1h' }
            );
            res.status(200).json({ token: token, uid: loadedUser._id.toString() });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
        next(err);
    });
};
