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
        type : DataTypes.TINYINT,
        field: 'is_picked_up',
        defaultValue : 0,
        allowNull : false 
    },
    pickupTime: {
        type: DataTypes.DATE,
        field: 'pickup_time',
    }
}, {
    tableName : 'requests',
    timestamps : true,
    createdAt : 'created_at',
    updatedAt : false
});

module.exports = Request;