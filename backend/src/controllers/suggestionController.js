const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createSuggestion = async (req, res) => {
    try {
        const { title, description, suggesterName } = req.body;
        const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

        const suggestion = await prisma.suggestion.create({
            data: {
                title,
                description,
                suggesterName,
                fileUrl
            }
        });

        res.status(201).json(suggestion);
    } catch (error) {
        console.error("Error creating suggestion:", error);
        res.status(500).json({ error: "Failed to create suggestion", details: error.message });
    }
};

const getAllSuggestions = async (req, res) => {
    try {
        const suggestions = await prisma.suggestion.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(suggestions);
    } catch (error) {
        console.error("Error fetching suggestions:", error);
        res.status(500).json({ error: "Failed to fetch suggestions" });
    }
};

const updateSuggestionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'approved' or 'rejected'

        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        const suggestion = await prisma.suggestion.update({
            where: { id: parseInt(id, 10) },
            data: { status }
        });

        res.json(suggestion);
    } catch (error) {
        console.error("Error updating suggestion status:", error);
        res.status(500).json({ error: "Failed to update suggestion status" });
    }
};

const deleteSuggestion = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.suggestion.delete({
            where: { id: parseInt(id, 10) }
        });
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting suggestion:", error);
        res.status(500).json({ error: "Failed to delete suggestion" });
    }
};

module.exports = {
    createSuggestion,
    getAllSuggestions,
    updateSuggestionStatus,
    deleteSuggestion
};
