const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Sectors
const getSectors = async (req, res) => {
    try {
        const sectors = await prisma.sector.findMany({ orderBy: { name: 'asc' } });
        res.json(sectors);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sectors', error: error.message });
    }
};

const createSector = async (req, res) => {
    const { name } = req.body;
    try {
        const sector = await prisma.sector.create({ data: { name } });
        res.json(sector);
    } catch (error) {
        res.status(500).json({ message: 'Error creating sector', error: error.message });
    }
};

const deleteSector = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.sector.delete({ where: { id: Number(id) } });
        res.json({ message: 'Sector deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting sector', error: error.message });
    }
};

// Modalities
const getModalities = async (req, res) => {
    try {
        const modalities = await prisma.modality.findMany({ orderBy: { name: 'asc' } });
        res.json(modalities);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching modalities', error: error.message });
    }
};

const createModality = async (req, res) => {
    const { name } = req.body;
    try {
        const modality = await prisma.modality.create({ data: { name } });
        res.json(modality);
    } catch (error) {
        res.status(500).json({ message: 'Error creating modality', error: error.message });
    }
};

const deleteModality = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.modality.delete({ where: { id: Number(id) } });
        res.json({ message: 'Modality deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting modality', error: error.message });
    }
};

module.exports = {
    getSectors,
    createSector,
    deleteSector,
    getModalities,
    createModality,
    deleteModality
};
