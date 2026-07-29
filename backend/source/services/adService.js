const Ad = require('../models/Ad');

const getAllActiveAds = async () => {
    // Φέρνει όλες τις αγγελίες με status 'active'
    return await Ad.findAll({
        where: { status: 'active' },
        order: [['created_at', 'DESC']]
    });
};

const createAd = async (adData) => {
    const newadData = {
        ...adData
    }
    
    const newAd = await Ad.create({
        cook_id: newadData.cook_Id,
        title: newadData.title,
        description: newadData.description,
        allergens: newadData.allergens,
        portions: newadData.portions,
        pickup_location: newadData.pickup_location,
        pickup_time: newadData.pickup_time
    });
    
    return {
        newAd: {
            id: newAd.id,
            cook_id: newAd.cook_id,
            title: newAd.title,
            description: newAd.description,
            allergens: newAd.allergens,
            portions: newAd.portions,
            pickup_location: newAd.pickup_location,
            pickup_time: newAd.pickup_time,
            status: newAd.status
        }
    };
};

module.exports = {
    getAllActiveAds,
    createAd
};