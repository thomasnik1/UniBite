const { DataTypes } = require('sequelize');
const sequelize = require('../configuration/database');

const Rating = sequelize.define('Rating', {
    consumer_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    request_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
}, {
    tableName: 'ratings',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = Rating;