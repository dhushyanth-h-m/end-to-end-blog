const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('Admin', 'Editor', 'Reader'),
            defaultValue: 'Reader',
        },
        name: {
            type: DataTypes.STRING,
        },
        profileImageUrl: {
            type: DataTypes.STRING,
        },
    });
    return User;
};