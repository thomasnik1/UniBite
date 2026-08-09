const ratingService = require('../services/ratingService');

const createRating = async (req, res) => {
    try {
        const result = await ratingService.createRating({
            consumer_id : req.user.userId,
            request_id : req.body.request_id,
            rating : req.body.rating
        });

        res.status(201).json({ message: 'Η αξιολόγηση δημιουργήθηκε!', rating: result });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Σφάλμα κατά τη δημιουργία της αξιολόγησης', error: error.message });
    }
};

const editRating = async (req, res) => {
    try {
        const result =  await ratingService.editRating({
            user_id : req.user.userId,
            rating_id : req.body.request_id,
            rating : req.body.rating
        });

    res.status(200).json({ message: 'Η αξιολογηση ενημερωσθηκε επιτυχως', rating: result});
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Η ενημερωση της αξιολογησης απετυχε', error: error.message });
    }
};

module.exports = {
    createRating,
    editRating
};