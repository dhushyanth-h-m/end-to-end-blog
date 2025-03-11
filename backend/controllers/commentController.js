const { Comment } = require('../models');
const { validationResult } = require('express-validator');

const createComment = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { postId } = req.params;
    const { content } = req.body; 
    const userId = req.user.id; 

    try{
        const newComment = await Comment.create({ post_id: postId, user_id: userId, content });
        res.status(201).json(newComment);
    } catch (error) {
        next(error);
    }
};