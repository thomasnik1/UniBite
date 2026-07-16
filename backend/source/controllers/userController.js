const userService = require('../services/userService');

const createUser = async (req, res) => {
    try{
        const users = await userService.createUser(req.body);
        res.status(201).json({ message: 'Ο χρήστης δημιουργήθηκε!', user: users });   
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Αποτυχία δημιουργίας χρήστη' });
    }
};

module.exports = {
    createUser
};