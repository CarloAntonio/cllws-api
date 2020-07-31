
const Profile = require('../models/profile');

exports.getBasicInfo = async (req, res, next) => {
    try {
        const profile = await Profile.findOne({ 'user': req.uid}, 'hometown interest livesIn quote worksIn -_id', { lean: true });

        if (!profile) {
            const error = new Error('Could not find profile.');
            error.statusCode = 404;
            throw error;
        }

        return res.status(200).json(profile);
    } catch(err){
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.updateBasicInfo = async (req, res, next) => {
    const data = req.body.data;

    const options = {
        new: true,
        fields: {
            hometown: 1,
            livesIn: 1,
            interest: 1,
            worksIn: 1,
            quote: 1,
        }
    }

    try {
        const profile = await Profile.findOneAndUpdate({ user: req.uid }, data, options);

        if (!profile) {
            const error = new Error('Could not find profile.');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json(profile);
    } catch(err){
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}