const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

const createUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'VIEWER'
            }
        });
        const { password: _, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.user.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};

const updateProfile = async (req, res) => {
    const { id } = req.user;
    const { name } = req.body;

    try {
        const user = await prisma.user.update({
            where: { id: id },
            data: { name },
            select: { id: true, name: true, email: true, role: true, avatarUrl: true }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};

const uploadAvatar = async (req, res) => {
    const { id } = req.user;
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;

    try {
        const user = await prisma.user.update({
            where: { id: id },
            data: { avatarUrl },
            select: { id: true, name: true, email: true, role: true, avatarUrl: true }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error uploading avatar', error: error.message });
    }
};

module.exports = { getAllUsers, createUser, deleteUser, updateProfile, uploadAvatar };
