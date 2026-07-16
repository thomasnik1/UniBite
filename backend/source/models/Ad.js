const { DataTypes } = require('sequelize');
const sequelize = require('../configuration/database');

const Ad = sequelize.define('Ad', {
    cook_id: {
        type: DataTypes.INTEGER,
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
    pickup_location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pickup_time: {
        type: DataTypes.DATE,
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