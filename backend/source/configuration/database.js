const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        timezone: '+03:00', // Ρύθμιση ζώνης ώρας σε GMT+3
        logging: false // Κρύβει τα SQL queries από το τερματικό για να είναι καθαρό
    }
);

module.exports = sequelize;