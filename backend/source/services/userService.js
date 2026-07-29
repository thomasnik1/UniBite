const { Op } = require('sequelize');
const User = require ('../models/User');
const jwt = require('jsonwebtoken');

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

    const token = jwt.sign(
        { userId: newUser.id, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    return {
        user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            credits: newUser.credits
        },
        token: token
    };
};

const loginUser = async (userData) => {
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

    const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    )

    return {
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            credits: user.credits
        },
        token: token
    };
    
};

const logoutUser = async (userId) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error('User not found');
    }
    return true;
};


module.exports = {
    createUser,
    loginUser,
    logoutUser
};