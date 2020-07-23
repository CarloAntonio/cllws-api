
const User = require('../models/user');
const Profile = require('../models/profile');

const uploadImg = require('../utils/fb');

exports.getBasicInfo = async (req, res, next) => {
    User.findById(req.uid)
        .then(user => {
            // check is a profile exist for user
            if(user.profile){
                return Profile.findById(user.profile.toString())
            } else {
                res.status(200).json({ message: "No Associated Profile Found"});
            }
        })
        .then(profile => {
            res.status(200).json({ message: "Found It"});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });    
}

exports.updateProfilePic = async (req, res, next) => {
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
            console.log(result)
            res.status(200).send({
                picUrl: picUrl,
                status: 'success'
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