const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getStats = async (req, res) => {
    try {
        const totalDocuments = await prisma.document.count();
        const totalUsers = await prisma.user.count();
        
        const topDocuments = await prisma.document.findMany({
            orderBy: { downloads: 'desc' },
            take: 5,
            select: { title: true, downloads: true, status: true, version: true, type: true, sector: true, modality: true }
        });

        // Recent Uploads (Last 24h)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const recentUploads = await prisma.document.count({
            where: { createdAt: { gte: yesterday } }
        });

        // Calculate total downloads
        const allDocs = await prisma.document.findMany({ select: { downloads: true } });
        const totalDownloads = allDocs.reduce((acc, doc) => acc + doc.downloads, 0);

        // Mocking trend data for now as we don't have historical download logs
        const analyticsData = [
            { name: 'Jan', downloads: 400 },
            { name: 'Feb', downloads: 300 },
            { name: 'Mar', downloads: 600 },
            { name: 'Apr', downloads: 800 },
            { name: 'May', downloads: 500 },
            { name: 'Jun', downloads: 900 },
        ];

        res.json({
            totalDocuments,
            totalUsers,
            totalDownloads,
            topDocuments,
            recentUploads,
            analyticsData
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching analytics', error: error.message });
    }
};

module.exports = { getStats };
