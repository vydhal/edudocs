const { PrismaClient } = require('@prisma/client');
const { generateToken, comparePassword, hashPassword } = require('../utils/auth');

const prisma = new PrismaClient();

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user;

    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const register = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await hashPassword(password);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'VIEWER'
            }
        });

        const token = generateToken(user);
        const { password: _, ...userWithoutPassword } = user;

        res.status(201).json({ token, user: userWithoutPassword });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

module.exports = { login, register };
