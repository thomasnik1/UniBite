const userService = require('../services/userService');

const createUser = async (req, res) => {
    try{
        const newUser = await userService.createUser(req.body);
        res.status(201).json({ message: 'Ο χρήστης δημιουργήθηκε!', user: newUser });   
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Αποτυχία δημιουργίας χρήστη' });
    }
};

const authenticateUser = async (req, res) => {
    try {
        const user = await userService.authenticateUser(req.body);
        res.status(200).json({ message: 'Επιτυχής σύνδεση!', user: user });
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: 'Αποτυχία σύνδεσης χρήστη' });
    }
};

module.exports = {
    createUser,
    authenticateUser
};