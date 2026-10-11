const ratingService = require('../services/ratingService');
const AppError = require('../utilities/AppError');

const createRating = async (req, res) => {
    try {
        const newRatingData = {
            consumerId: req.user.userId,
            ...req.body
        }

        const result = await ratingService.createRating(newRatingData);
        res.status(201).json({ message: 'Η αξιολόγηση δημιουργήθηκε!', rating: result });
    }
    catch (error) {
        console.error(error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        res.status(500).json({ message: 'Σφάλμα κατά τη δημιουργία της αξιολόγησης', error: error.message });
    }
};

module.exports = {
    createRating
};