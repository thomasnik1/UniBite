const { DataTypes } = require('sequelize');
const sequelize = require('../configuration/database');

const Rating = sequelize.define('Rating', {
    consumerId: {
        type: DataTypes.INTEGER,
        field: 'consumer_id',
        allowNull: false
    },
    requestId: {
        type: DataTypes.INTEGER,
        field: 'request_id',
        allowNull: false
    },
    ratingScore: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'score',
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