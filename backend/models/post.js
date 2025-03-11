module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('draft', 'published'),
            defaultValue: 'draft',
        },
    });

    Post.associate = (models) => {
        Post.belongsTo(models.User, {
            foreignKey: {
                allowNull: false,
            },
            onDelete: 'CASCADE', 
        });

        Post.hasMany(models.Comment, {
            foreignKey: 'postId',
            as: 'comments',
        });

        Post.belongsToMany(models.Category, {
            through: 'PostCategory',
            as: 'categories',
            foreignKey: 'postId',
        });

        Post.belongsToMany(models.Tag, {
            through: 'PostTag',
            as: 'tags',
            foreignKey: 'postId',
        });
    };

    return Post;
}