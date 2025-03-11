module.exports = (sequelize, DataTypes) => {
    const Tag = sequelize.define('Tag', {
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
    });

    Tag.associate = (models) => {
        Tag.belongsToMany(models.Post, {
            through: 'PostTag', 
            as: 'posts', 
            foreignKey: 'tagId',
        });
    };

    return Tag;
};