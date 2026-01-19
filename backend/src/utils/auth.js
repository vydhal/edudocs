const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';

const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1d' });
};

const verifyToken = (token) => {
  return jwt.verify(token, SECRET_KEY);
};

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

module.exports = { generateToken, verifyToken, hashPassword, comparePassword };
