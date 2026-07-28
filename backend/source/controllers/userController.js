const jwt = require('jsonwebtoken');
const userService = require('../services/userService');

const createUser = async (req, res) => {
    try{
        const result = await userService.createUser(req.body);
        res.status(201).json({
            message: 'Ο χρήστης δημιουργήθηκε!', 
            user: result.user,
            token: result.token
        });   
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Αποτυχία δημιουργίας χρήστη' });
    }
};

const loginUser = async (req, res) => {
    try {
        const result = await userService.loginUser(req.body);
        res.status(200).json({
            message: 'Επιτυχής σύνδεση!', 
            user: result.user,
            token: result.token
         });
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: 'Αποτυχία σύνδεσης χρήστη' });
    }
};

const logoutUser = async (req, res) => {
    try{
        const user = await userService.logoutUser(req.body);
        res.status(200).json({ message: 'Επιτυχής αποσύνδεση!', user: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Αποτυχία αποσύνδεσης χρήστη' });
    }
};

module.exports = {
    createUser,
    loginUser,
    logoutUser
};