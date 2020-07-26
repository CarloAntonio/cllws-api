
// libraries
const { validationResult } = require('express-validator');

// models
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

        // return response
        res.status(200).json(result.getPublicFields());
    } catch(err){
        return err;
    }
}

exports.getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find({ 'author': req.uid });
        const returnablePosts = posts.map(post => {
            return post.getPublicFields();
        })
        res.status(200).json(returnablePosts);
    } catch(err){
        return err
    }
}