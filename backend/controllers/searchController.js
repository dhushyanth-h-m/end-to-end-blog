const { Posts, Category, Tag } = require('../models');
const { Op } = require('sequelize');

const searchPosts = async (req, res, next) => {
    const { query } = req.query;

    try{
        const posts = await Posts.findAll({
            where: {
                [Op.or]: [
                    { title: { [Op.like]: `%${query}%`}},
                    { content: { [Op.like]: `%${query}%`}},
                ],
            },
            include: [ Category, Tag ],
        });
        res.json(posts);
    } catch (error){
        next(error);
    }
};