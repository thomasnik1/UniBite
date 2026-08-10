const bcrypt = require('bcrypt');
const saltRounds = 10;

const hashPassword = async (plainPassword) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(plainPassword, saltRounds);
        return hash;
    } catch (error) {
        throw new Error('Failed to hash password');
    };
};

const verifyPassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {
    hashPassword,
    verifyPassword
};