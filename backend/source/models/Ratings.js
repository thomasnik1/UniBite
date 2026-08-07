const { DataTypes } = require('sequelize');
const sequelize = require('../configuration/database');

const Rating = sequelize.define('Rating', {
    request_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    rating: {
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
    createdAt: 'created_at'
});

module.exports = Rating;