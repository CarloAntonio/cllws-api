
// models
const User = require('../models/user');
const Profile = require('../models/profile');

// utils
const uploadImg = require('../utils/fb');
const { deepCopy } = require('../utils/helpers');

exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.uid, 'username firstName lastName pic onBoarded friends sentRequest pendingRequest');

        if (!user) {
            const error = new Error('Could not find user.');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json(user);
    } catch(err){
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getUserPublic = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.params.username }, 'username firstName lastName pic friends', { lean: true });

        if (!user) {
            const error = new Error('Could not find user.');
            error.statusCode = 404;
            throw error;
        }

        const profile = await Profile.findOne({ user: user._id}, 'hometown interest livesIn quote worksIn -_id', { lean: true });
        
        const returnable = deepCopy(user);

        Object.keys(profile).forEach(field => {
            if(!profile[field].hidden) returnable[field] = profile[field]
        })
        
        res.status(200).json(returnable);

    } catch(err){
        console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
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