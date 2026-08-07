const ratingService = require('../services/ratingService');

const createRating = async (req, res) => {
    try {
        const consumer_id = req.user.UserId;
        const { request_id, rating } = req.body;

        const result = await ratingService.createRating(consumer_id, request_id, rating);
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