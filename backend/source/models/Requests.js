const { DataTypes } = require('sequelize');
const sequelize = require('../configuration/database');

const Request = sequelize.define('Request', {
    ad_id : {
        type : DataTypes.INTEGER,
        allowNull : false
    },
    consumer_id : {
        type : DataTypes.INTEGER,
        allowNull : false
    },
    status : {
        type : DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue : 'pending'
    },
    portions : {
        type : DataTypes.INTEGER,
        allowNull : false
    }
}, {
    tableName : 'requests',
    timestamps : true,
    createdAt : 'created_at',
    updatedAt : false
});

module.exports = Request;