// models/index.js

// 1. Εισαγωγή του connection της βάσης (προαιρετικό εδώ, αλλά καλή πρακτική)
const sequelize = require('../configuration/database'); // Ή όπου αλλού έχεις το αρχείο σύνδεσης

// 2. Εισαγωγή όλων των επιμέρους μοντέλων
const User = require('./User');
const Ad = require('./Ad');
const Request = require('./Request');
const Rating = require('./Rating');

// 3. ΟΡΙΣΜΟΣ ΤΩΝ ΣΥΣΧΕΤΙΣΕΩΝ (Εδώ γίνεται η μαγεία!)

// Σχέση User - Ad (Ένας μάγειρας έχει πολλές αγγελίες)
User.hasMany(Ad, { foreignKey: 'cook_id', as: 'ads' });
Ad.belongsTo(User, { foreignKey: 'cook_id', as: 'cook' });

// Σχέση Ad - Request (Μία αγγελία έχει πολλά αιτήματα)
Ad.hasMany(Request, { foreignKey: 'ad_id', as: 'requests' });
Request.belongsTo(Ad, { foreignKey: 'ad_id', as: 'ad' });

// Σχέση User - Request (Προαιρετικά: Ένας χρήστης κάνει πολλά αιτήματα)
User.hasMany(Request, { foreignKey: 'consumer_id', as: 'requests' });
Request.belongsTo(User, { foreignKey: 'consumer_id', as: 'requester' });

// 4. Εξαγωγή όλων μαζί σε ένα αντικείμενο
module.exports = {
    sequelize,
    User,
    Ad,
    Request,
    Rating
};