const { Op } = require('sequelize');
const { Ad, Request, User } = require('../models/models');
const jwt = require('jsonwebtoken');
const passwordService = require ('../services/passwordService');
const AppError = require('../utilities/AppError');

const createUser = async ({ username, password, email }) => {

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
            throw new AppError('Email already exists', 418);
        }
        else if (existingUser.username ===  username) {
            throw new Error('Username already exists');
        }
    }

    const hashedPassword = await passwordService.hashPassword(password);

    const newUser = await User.create({
        username : username,
        email: email,
        password: hashedPassword,
        role: 'student',
        credits: 5
    });

    const token = jwt.sign(
        { userId: newUser.id, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: '3h' }
    );

    const refreshToken = jwt.sign(
        { userId: newUser.id, role: newUser.role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );

    return {
        user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            password : newUser.password,
            role: newUser.role,
            credits: newUser.credits
        },
        token: token,
        refreshToken: refreshToken
    };
};

const loginUser = async ({ username, password }) => {
    const user = await User.findOne({ where : { username } });

    if (!user) {
        throw new Error('Invalid username or password');
    };

    const isPasswordValid = await passwordService.verifyPassword(password, user.password);

    if (!isPasswordValid) {
        throw new Error('Invalid username or password');

    };

    const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '3h' }
    );

    const refreshToken = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );

    return {
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            credits: user.credits
        },
        token: token,
        refreshToken: refreshToken
    };
    
};

const logoutUser = async (userId) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error('User not found');
    }
    return true;
};

const refreshToken = async (refreshToken) => {

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    if (!decoded) {
        throw new Error('Invalid refresh token');
    }

    const user = await User.findByPk(decoded.userId);
    
    if (!user) {
        throw new Error('User not found');
    }

    const newToken = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '3h' }
    ); 

    return {
        token: newToken
    };
};


module.exports = {
    createUser,
    loginUser,
    logoutUser,
    refreshToken
};