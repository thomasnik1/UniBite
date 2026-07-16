const { Op } = require('sequelize');
const User = require ('../models/User');

const createUser = async (userData) => {
    const {username, email, password } = userData;

    const existingUser = await User.findOne({
        where: {
            [Op.or]: [
                {email: email},
                {username: username}
            ]
        }
    });

    if (existingUser) {
        if (existingUser.email === email) {
            throw new Error('Email already exists');
        }
        else if (existingUser.username === username) {
            throw new Error('Username already exists');
        }
    }

    const newUser = await User.create({
        username,
        email,
        password,
        role: 'student',
        credits: 5
    });

    return {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        credits: newUser.credits
    };
};

const authenticateUser = async (userData) => {
    const { username, password } = userData;

    const user = await User.findOne({
        where: {
            username: username,
            password: password
        }
    });

    if (!user) {
        throw new Error('Invalid username or password');
    }

    return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        credits: user.credits
    };
};

module.exports = {
    createUser,
    authenticateUser
};