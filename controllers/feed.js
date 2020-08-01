
// libraries
const { validationResult } = require('express-validator');

// models
const User = require('../models/user');
const Post = require('../models/post');

// utils
const { deepCopy } = require('../utils/helpers');

exports.getFeed = async (req, res, next) => {
    const queryString = req.params.queryString;

    const friends = JSON.parse(queryString);

    try {
        const posts = await Post.find()
                                .where('author').in(friends)
                                .limit(20)
                                .select('text date author -_id')
                                .sort('-date')
                                .exec();

        // handle no post found errors
        if (!posts) {
            const error = new Error('Could not find any posts.');
            error.statusCode = 404;
            throw error;
        }
        
        // get unique array of authors of returned post
        const authorsArr = posts.map(post => post.author.toString())
        var uniqueAuthorsArray = [...new Set(authorsArr)];
        const updatedPosts = deepCopy(posts);

        // grab all author's pics
        const users = await User.find()
                                .where('_id').in(uniqueAuthorsArray)
                                .select('pic _id')
                                .exec();

        // convert array into object for easy searching later
        const userPics = {};
        users.forEach(user => userPics[user._id] = user.pic)

        // update posts to include user's pics
        updatedPosts.forEach(copiedPost => copiedPost.pic = userPics[copiedPost.author])

        // return posts
        res.status(200).json(updatedPosts);
    } catch(err){
        return err
    }
}