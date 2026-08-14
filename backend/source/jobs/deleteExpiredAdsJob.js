const { Op } = require('sequelize');
const { Ad } = require('../models/models');

const deleteExpiredAds = async() => {

    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() - 48);

    const expiredAds = await Ad.update(
        { status: 'deleted' },
        {
            where: {
                created_at: {
                    [Op.lt]: expirationDate
                },
                status: 'active'
            }
        }
    );
    console.log(`Deleted ${expiredAds[0]} expired ads.`);

};

module.exports = {
    deleteExpiredAds
};