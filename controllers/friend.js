
const User = require('../models/user');

exports.getFriends = async (req, res, next) => {
    try {
        const friends = await User.find({ friends: req.uid }, 'firstName lastName pic username');
        res.status(200).json(friends);
    } catch(err) {
        return err;
    }
}

exports.addRequest = async (req, res, next) => {
    const requestorId = req.uid;
    const requesteeUsername = req.body.username;

    let requestor = null;
    try{
        requestor = await User.findById(requestorId);
        if (!requestor) {
            const error = new Error('Could not find user.');
            error.statusCode = 404;
            throw error;
        }

        requestee = await User.findOne({ username: requesteeUsername});
        if (!requestee) {
            const error = new Error('Could not find user.');
            error.statusCode = 404;
            throw error;
        }

        const minRequestor = {
            uid: requestor._id.toString(),
            username: requestor.username,
            firstName: requestor.firstName,
            lastName: requestor.lastName,
            pic: requestor.pic
        }

        const minRequestee = {
            uid: requestee._id.toString(),
            username: requestee.username,
            firstName: requestee.firstName,
            lastName: requestee.lastName,
            pic: requestee.pic
        }

        requestor.sentRequest.push(minRequestee)
        const result1 = await requestor.save();
        if (!result1) {
            const error = new Error('Error sending friend request.');
            error.statusCode = 404;
            throw error;
        }

        requestee.pendingRequest.push(minRequestor);
        const result2 = await requestee.save();
        if (!result2) {
            const error = new Error('Error sending friend request.');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ok: true});
    } catch(err){
        console.log(err);
        return err;
    }
}