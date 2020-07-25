
const User = require('../models/user');
const Profile = require('../models/profile');

exports.getBasicInfo = async (req, res, next) => {
    User.findById(req.uid)
        .then(user => {
            if (!user.profile) {
                const error = new Error('No Associated Profile Found');
                error.statusCode = 404;
                throw error;
            }

            return Profile.findById(user.profile.toString())
        })
        .then(profile => {
            return res.status(200).json({
                hometown: profile.hometown,
                interest: profile.interest,
                livesIn: profile.livesIn,
                quote: profile.quote,
                worksIn: profile.worksIn,
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });    
}

exports.updateBasicInfo = async (req, res, next) => {
    const data = req.body.data;
    Profile.findOne({ 'user': req.uid })
        .then(profile => {
            Object.keys(data).forEach(key => {
                profile[key] = data[key];
            })
            return profile.save()
        })
        .then(result => {
            res.status(200).json(result.getPublicFields());
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}