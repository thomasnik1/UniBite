const { DataTypes } = require('sequelize');
const sequelize = require('../configuration/database');

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('student', 'admin'),
        defaultValue: 'student'
    },
    credits: {
        type: DataTypes.INTEGER,
        defaultValue: 5
    },
}, {
    tableName: 'users',
    timestamps: false,
    updatedAt: false
});

module.exports = User;