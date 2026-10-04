const isAdmin = (req, res, next) => {
    // Υποθέτουμε ότι το authenticateToken έχει ήδη τρέξει και έχει γεμίσει το req.user
    if (req.user && req.user.role === 'admin') {
        next(); // Είναι Admin, προχώρα στο controller!
    } else {
        res.status(403).json({ message: 'Απαγορεύεται η πρόσβαση. Απαιτούνται δικαιώματα Admin.' });
    }
};

module.exports = isAdmin;