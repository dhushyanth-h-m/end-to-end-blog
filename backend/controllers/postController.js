const { Post } = require('../models');
const { validationResult } = require('express-validator');

const createPost = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, content } = req.body;
    const userId = req.user.id;

    try{
        const newPost = await Post.create({ user_id: userId, title, content });
        res.status(201).json(newPost);
    } catch (error) {
        next(error);
    }
};