const multer = require('multer');
const path = require('path');

// Ρύθμιση για το πού και πώς θα αποθηκεύονται τα αρχεία
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Ο φάκελος που θα σώζονται
    },
    filename: function (req, file, cb) {
        // Βάζουμε ένα timestamp στο όνομα για να μην υπάρχουν διπλότυπα
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

module.exports = upload;