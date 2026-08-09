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

module.exports = {
    createRating
};