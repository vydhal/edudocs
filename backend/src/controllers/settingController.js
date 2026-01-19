const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getSettings = async (req, res) => {
    try {
        const settings = await prisma.setting.findMany();
        // Convert array to object { key: value }
        const settingsObj = settings.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});
        res.json(settingsObj);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching settings', error: error.message });
    }
};

const updateSettings = async (req, res) => {
    const settings = req.body; // Expecting object { key: value }
    try {
        const updates = Object.keys(settings).map(key => {
            return prisma.setting.upsert({
                where: { key },
                update: { value: String(settings[key]) },
                create: { key, value: String(settings[key]) }
            });
        });
        
        await Promise.all(updates);
        res.json({ message: 'Settings updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating settings', error: error.message });
    }
};

const uploadLogo = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const logoUrl = `/uploads/${req.file.filename}`;

    try {
        await prisma.setting.upsert({
            where: { key: 'logoUrl' },
            update: { value: logoUrl },
            create: { key: 'logoUrl', value: logoUrl }
        });

        res.json({ message: 'Logo uploaded successfully', logoUrl });
    } catch (error) {
        res.status(500).json({ message: 'Error updating logo setting', error: error.message });
    }
};

module.exports = { getSettings, updateSettings, uploadLogo };
