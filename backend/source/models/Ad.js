const { DataTypes } = require('sequelize');
const sequelize = require('../configuration/database');

const Ad = sequelize.define('Ad', {
    cookId: {
        type: DataTypes.INTEGER,
        field: 'cook_id',
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    allergens: {
        type: DataTypes.TEXT
    },
    portions: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    pickupLocation: {
        type: DataTypes.STRING,
        field: 'pickup_location',
        allowNull: false
    },
    pickupTime: {
        type: DataTypes.DATE,
        field: 'pickup_time',
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive', 'deleted'),
        defaultValue: 'active'
    }
}, {
    tableName: 'ads',
    timestamps: true, // Διαχειρίζεται αυτόματα το created_at
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = Ad;