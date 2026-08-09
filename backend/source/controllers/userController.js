const userService = require('../services/userService');

const createUser = async (req, res) => {
    try{
        const result = await userService.createUser(req.body);
        res.status(201).json({
            message: 'Ο χρήστης δημιουργήθηκε!', 
            user: result.user,
            token: result.token,
            refreshToken: result.refreshToken
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
            token: result.token,
            refreshToken: result.refreshToken
         });
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: 'Αποτυχία σύνδεσης χρήστη' });
    }
};

const logoutUser = async (req, res) => {
    try{
        const userId = req.user.userId; // Assuming the user ID is available in the request object after authentication
        const result = await userService.logoutUser(userId);
        res.status(200).json({ message: 'Επιτυχής αποσύνδεση!', user: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Αποτυχία αποσύνδεσης χρήστη' });
    }
};

const refreshToken = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const refreshToken = authHeader && authHeader.split(' ')[1];
        
        if (!refreshToken) {
            return res.status(401).json({ error: 'Refresh token not provided' });
        }
        
        const result = await userService.refreshToken(refreshToken);
        res.status(200).json({ refreshToken: result.token });
    } catch (error) {
        console.error(error);
        res.status(403).json({ error: 'Invalid refresh token' });
    }
}

module.exports = {
    createUser,
    loginUser,
    logoutUser,
    refreshToken
};