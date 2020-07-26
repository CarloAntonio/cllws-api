
// models
const User = require('../models/user');
const Profile = require('../models/profile');

// utils
const uploadImg = require('../utils/fb');

exports.getUser = (req, res, next) => {
    User.findById(req.uid)
        .then(user => {
            if (!user) {
                const error = new Error('Could not find user.');
                error.statusCode = 404;
                throw error;
            }

            const publicFields = user.getPrivateFields();
            
            res.status(200).json({
                uid: user._id, 
                ...publicFields
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });    
}

exports.getUserPublic = (req, res, next) => {
    let user = null;
    User.findOne({ username: req.params.username })
        .then(result => {
            if (!result) {
                const error = new Error('Could not find user.');
                error.statusCode = 404;
                throw error;
            }

            user = result;

            return Profile.findOne({ user: result._id})
        })
        .then(profile => {
            const profileFields = profile.getPublicFields();
            const userFields = user.getPublicFields();
            
            const returnable = { ...userFields }
            Object.keys(profileFields).forEach(field => {
                if(!profileFields[field].hidden) returnable[field] = profileFields[field]
            })
            
            res.status(200).json(returnable);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });    
}

exports.updateUser = async (req, res, next) => {
    const data = req.body.data;

    if(Object.keys(data).length === 0 && data.constructor === Object) {
        const error = new Error("Nothing to Edit");
        error.statusCode = 401;
        throw error;
    }

    try {
        // query db for user
        const user = await User.findById(req.uid);

        // check if user exist
        if (!user) {
            const error = new Error('Could not find user.');
            error.statusCode = 404;
            throw error;
        }

        //update user fields
        Object.keys(data).forEach(key => {
            user[key] = data[key];
        })

        // save changes to db
        const result = await user.save();

        // extract public fields
        const publicFields = result.getPrivateFields();

        // return response
        res.status(200).json({
            uid: result._id, 
            ...publicFields
        });

    } catch(err){
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

exports.updateUserPic = async (req, res, next) => {
    const file = req.file

    let picUrl = null;
    if (file) {
        uploadImg(file).then(url => {
            picUrl = url
            return User.findById(req.uid)
        })
        .then(user => {
            user.pic = picUrl
            return user.save()
        })
        .then(result => {
            res.status(200).send({
                pic: result.pic,
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
    }
}