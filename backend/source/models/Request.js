const { DataTypes } = require('sequelize');
const sequelize = require('../configuration/database');

const Request = sequelize.define('Request', {
    adId : {
        type : DataTypes.INTEGER,
        field: 'ad_id',
        allowNull : false
    },
    consumerId : {
        type : DataTypes.INTEGER,
        field: 'consumer_id',
        allowNull : false
    },
    status : {
        type : DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue : 'pending'
    },
    portions : {
        type : DataTypes.INTEGER,
        allowNull : false
    },
    isPickedUp : {
        type : DataTypes.BOOLEAN,
        field: 'is_picked_up',
        defaultValue : 'false',
        allowNull : false 
    },
    pickupTime: {
        type: DataTypes.DATE,
        field: 'pickup_time',
    },
    penaltyApplied: {
        type: DataTypes.BOOLEAN,
        field: 'penalty_applied',
        defaultValue: 'false'
    }
}, {
    tableName : 'requests',
    timestamps : true,
    createdAt : 'created_at',
    updatedAt : false
});

module.exports = Request;