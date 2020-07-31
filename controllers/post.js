
// libraries
const { validationResult } = require('express-validator');

// models
const User = require('../models/user');
const Post = require('../models/post');

exports.addPost = async (req, res, next) => {
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

    // extract body data
    const text = req.body.text;

    const post = new Post({
        text: text,
        author: req.uid
    })

    try {
        const result = await post.save();

        if (!result) {
            const error = new Error("Couldn't create new post");
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json(result.getPublicFields());
    } catch(err){
        return err;
    }
}

exports.getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find({ 'author': req.uid }, 'text date author -_id');

        // handle no post found errors
        if (!posts) {
            const error = new Error('Could not find any posts.');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json(posts);
    } catch(err){
        return err
    }
}

exports.getPostsPublic = async (req, res, next) => {
    
    try{
        // projecting only username + id limits the amount of data 
        // that need to be return => faster load times
        const user = await User.findOne({ username: req.params.username }, 'username'); 

        if (!user) {
            const error = new Error('Could not find user.');
            error.statusCode = 404;
            throw error;
        }

        const posts = await Post.find({ author: user._id }, 'text date author -_id')
        if (!posts) {
            const error = new Error('Could not find any posts.');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json(posts);

    } catch(err){
        return err;
    }
}