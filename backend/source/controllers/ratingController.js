const ratingService = require('../services/ratingService');

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
        res.status(500).json({ message: 'Σφάλμα κατά τη δημιουργία της αξιολόγησης', error: error.message });
    }
};

const editRating = async (req, res) => {
    try {
        const editRatingData = {
            raterId: req.user.userId,
            ...req.body
        };
        
        const result = await ratingService.editRating(editRatingData);
        res.status(200).json({ message: 'Η αξιολογηση ενημερωσθηκε επιτυχως', rating: result});
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Η ενημερωση της αξιολογησης απετυχε', error: error.message });
    }
};

const deleteRating = async (req, res) => {
    try {

        const deleteRatingData = {
            ratingId: req.params.id,
            raterId: req.user.userId
        };

        const result = await ratingService.deleteRating(deleteRatingData);
        res.status(200).json({ message: 'Η αγιολογηση διαγραφθηκε επιτυχως', rating: result });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Σφαλμα κατα τη διαγραφη της αξιολογησης', error: error.message });
    }
};


module.exports = {
    createRating,
    editRating,
    deleteRating
};