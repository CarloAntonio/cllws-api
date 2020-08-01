
const User = require('../models/user');

exports.getFriends = async (req, res, next) => {
    try {
        const friends = await User.find({ friends: req.uid }, 'firstName lastName pic username');
        res.status(200).json(friends);
    } catch(err) {
        return err;
    }
}

exports.getFriendsPublic = async (req, res, next) => {
    try {
        const friends = await User.find({ friends: req.params.id }, 'firstName lastName pic username');
        res.status(200).json(friends);
    } catch(err) {
        return err;
    }
}

exports.addRequest = async (req, res, next) => {
    const userId = req.uid;
    const friendId = req.body.friendId;

    try{
        // get "minified" version of users
        const userMin = await User.findById(userId, 'username firstName lastName pic');
        if (!userMin) {
            const error = new Error('Could not find user.');
            error.statusCode = 404;
            throw error;
        }

        const friendMin = await User.findById(friendId, 'username firstName lastName pic');
        if (!friendMin) {
            const error = new Error('Could not find user.');
            error.statusCode = 404;
            throw error;
        }

        // set options
        const options = {
            new: true,
            fields: {
                sentRequest: 1,
                pendingRequest: 1
            }
        }

        // update user with new friend request
        const userUpdate = {
            $addToSet: { sentRequest: friendMin }
        }

        const user = await User.findByIdAndUpdate(userId, userUpdate, options);
        if (!user) {
            const error = new Error('Could not find user.');
            error.statusCode = 404;
            throw error;
        }

        // update friend with new friend request
        const friendUpdate = {
            $addToSet: { pendingRequest: userMin }
        }

        const friend = await User.findByIdAndUpdate(friendId, friendUpdate, options);
        if (!friend) {
            const error = new Error('Could not find user.');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json(user);
    } catch(err){
        console.log(err);
        return err;
    }
}

exports.friendRequestOutcome = async (req, res, next) => {
    const userId = req.uid;
    const friendId = req.body.friendId;
    const outcome = req.body.outcome

    try{
        let userUpdate = {
            $pull: {
                pendingRequest: { _id: friendId}
            }
        }

        if(outcome === 'add') {
            userUpdate = {
                $pull: {
                    pendingRequest: { _id: friendId}
                },
                $addToSet: { friends: friendId }
            }
        }
    
        const userOptions = {
            new: true,
            fields: {
                friends: 1,
                sentRequest: 1,
                pendingRequest: 1
            }
        }

        const user = await User.findByIdAndUpdate(userId, userUpdate, userOptions);
        if (!user) {
            const error = new Error('Could not find user.');
            error.statusCode = 404;
            throw error;
        }

        let friendUpdate = {
            $pull: {
                sentRequest: { _id: user._id}
            }
        }

        if(outcome === 'add') {
            friendUpdate = {
                $pull: {
                    pendingRequest: { _id: friendId}
                },
                $addToSet: { friends: userId }
            }
        }

        const friend = await User.findByIdAndUpdate(friendId, friendUpdate);
        if (!friend) {
            const error = new Error('Could not find user.');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json(user);
    } catch(err){
        console.log(err);
        return err;
    }
}