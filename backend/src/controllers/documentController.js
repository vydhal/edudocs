const { PrismaClient } = require('@prisma/client');
const path = require('path');

const prisma = new PrismaClient();

const getAllDocuments = async (req, res) => {
    const { status, search, sectorId, modalityId, type, page = 1, limit = 30, paginate = 'true' } = req.query;
    try {
        const where = {};
        if (status) where.status = status;
        if (sectorId) where.sectorId = parseInt(sectorId);
        if (modalityId) where.modalityId = parseInt(modalityId);
        if (type) where.type = type;

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }

        const orderBy = { createdAt: 'desc' };
        const include = {
            author: { select: { name: true } },
            sector: true,
            modality: true
        };

        if (paginate === 'false') {
            const documents = await prisma.document.findMany({ where, include, orderBy });
            return res.json(documents);
        }

        const p = parseInt(page);
        const l = parseInt(limit);
        const skip = (p - 1) * l;

        const [documents, total] = await prisma.$transaction([
            prisma.document.findMany({ where, include, orderBy, skip, take: l }),
            prisma.document.count({ where })
        ]);

        res.json({
            documents,
            total,
            pages: Math.ceil(total / l),
            currentPage: p
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching documents', error: error.message });
    }
};

const uploadDocument = async (req, res) => {
    const { title, description, parentId, type, sectorId, modalityId, existingFileUrl } = req.body;
    // req.file contains the file info if using multer
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : (existingFileUrl || '');
    const userId = req.user.id;

    try {
        let version = 1;
        let rootParentId = null;

        if (parentId) {
            const parentDoc = await prisma.document.findUnique({ where: { id: parseInt(parentId) } });
            if (!parentDoc) {
                return res.status(404).json({ message: 'Parent document not found' });
            }

            // If the parent has a parent, use that as the root (flatten hierarchy)
            rootParentId = parentDoc.parentId || parentDoc.id;

            // Find all versions to determine new version number
            const versions = await prisma.document.findMany({
                where: {
                    OR: [
                        { id: rootParentId },
                        { parentId: rootParentId }
                    ]
                },
                select: { version: true }
            });

            const maxVersion = Math.max(...versions.map(d => d.version));
            version = maxVersion + 1;
            // Inherit classification from parent if not specified (optional logic, but keeping it simple for now)
        }

        const document = await prisma.document.create({
            data: {
                title,
                description,
                fileUrl,
                version,
                parentId: rootParentId ? parseInt(rootParentId) : null,
                authorId: userId,
                status: 'published',
                type: type || 'PDF', // Default to PDF if not provided
                sectorId: sectorId ? parseInt(sectorId) : null,
                modalityId: modalityId ? parseInt(modalityId) : null
            }
        });
        res.status(201).json(document);
    } catch (error) {
        res.status(500).json({ message: 'Error uploading document', error: error.message });
    }
};

const getDocumentVersions = async (req, res) => {
    const { id } = req.params;
    try {
        const doc = await prisma.document.findUnique({ where: { id: parseInt(id) } });
        if (!doc) {
            return res.status(404).json({ message: 'Document not found' });
        }

        const rootId = doc.parentId || doc.id;

        const versions = await prisma.document.findMany({
            where: {
                OR: [
                    { id: rootId },
                    { parentId: rootId }
                ]
            },
            include: { author: { select: { name: true } } },
            orderBy: { version: 'desc' }
        });

        res.json(versions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching document versions', error: error.message });
    }
};

const deleteDocument = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.document.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Document deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting document', error: error.message });
    }
};

const createDocumentVersion = async (req, res) => {
    const { id } = req.params;
    const { title, description, type, sectorId, modalityId } = req.body;
    const userId = req.user.id;
    // req.file contains the file info if using multer

    try {
        const currentDoc = await prisma.document.findUnique({ where: { id: parseInt(id) } });

        if (!currentDoc) {
            return res.status(404).json({ message: 'Document not found' });
        }

        const fileUrl = req.file ? `/uploads/${req.file.filename}` : currentDoc.fileUrl;

        // Find the root parent ID
        const rootParentId = currentDoc.parentId || currentDoc.id;

        // Find max version
        const versions = await prisma.document.findMany({
            where: {
                OR: [
                    { id: rootParentId },
                    { parentId: rootParentId }
                ]
            },
            select: { version: true }
        });

        const maxVersion = Math.max(...versions.map(d => d.version));
        const newVersion = maxVersion + 1;

        // Archive the current document by updating it (pseudo-archive) or create new entry?
        // Strategy: The logic here is "Versioning". 
        // 1. We create a NEW document entry that represents the new version.
        // 2. We keep the "original" or "previous" ones as they are.
        // 3. Effectively, the "latest" is just another document in the chain.
        // But the UI lists "Documents". We want to show only the LATEST. (This logic is already in getAllDocuments? No, getAllDocuments returns ALL.)
        // Correction: getAllDocuments currently returns ALL documents.
        // To support versioning properly, getAllDocuments should probably only return the latest version of each "Document Family".
        // BUT, for now, let's keep it simple: Create new document with parentId pointing to the root.

        // Wait! The User wants to EDIT.
        // If I create a new document, the old one remains "Published".
        // We should mark the OLD one as 'archived' if we want only one active.
        // OR filtering logic needs update.

        // Let's UPDATE the status of the previous head to 'archived' if we only want one shown?
        // Or simply create the new one.

        // The prompt says: "ao edita ro usuário pode substituir o documento...o fato de editar o docuemnto deve aparecer no histórico com data"
        // So we create a NEW version.

        const newDoc = await prisma.document.create({
            data: {
                title: title || currentDoc.title,
                description: description || currentDoc.description,
                fileUrl: fileUrl,
                version: newVersion,
                parentId: rootParentId,
                authorId: userId,
                status: 'published',
                type: type || currentDoc.type,
                sectorId: sectorId ? parseInt(sectorId) : currentDoc.sectorId,
                modalityId: modalityId ? parseInt(modalityId) : currentDoc.modalityId
            }
        });

        // Optionally, we could set the `currentDoc` status to 'archived' if we don't want duplicates in the main list.
        // Let's do that to keep the list clean.
        await prisma.document.update({
            where: { id: parseInt(id) },
            data: { status: 'archived' }
        });

        res.status(201).json(newDoc);

    } catch (error) {
        res.status(500).json({ message: 'Error creating document version', error: error.message });
    }
};

const exportDocuments = async (req, res) => {
    try {
        const documents = await prisma.document.findMany({
            include: { author: true, sector: true, modality: true },
            orderBy: { createdAt: 'desc' }
        });

        const csvHeader = 'Titulo,Setor,Modalidade,Tipo,Autor,Data\n';
        const csvRows = documents.map(doc => {
            const sectorName = doc.sector ? doc.sector.name : 'N/A';
            const modalityName = doc.modality ? doc.modality.name : 'N/A';
            const type = doc.type || 'N/A';
            const authorName = doc.author ? doc.author.name : 'Desconhecido';
            const date = new Date(doc.createdAt).toLocaleDateString();

            // Escape quotes and handle commas
            const title = `"${doc.title.replace(/"/g, '""')}"`;

            return `${title},${sectorName},${modalityName},${type},${authorName},${date}`;
        }).join('\n');

        const csvContent = csvHeader + csvRows;

        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', 'attachment; filename="documentos_edudocs.csv"');
        res.send(csvContent);
    } catch (error) {
        res.status(500).json({ message: 'Error exporting documents', error: error.message });
    }
};

const trackDownload = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.document.update({
            where: { id: parseInt(id) },
            data: { downloads: { increment: 1 } }
        });
        res.status(200).json({ message: 'Download tracked' });
    } catch (error) {
        console.error('Error tracking download:', error);
        // Do not block download if tracking fails, but returns error
        res.status(500).json({ message: 'Error tracking download' });
    }
};

module.exports = { getAllDocuments, uploadDocument, deleteDocument, getDocumentVersions, exportDocuments, createDocumentVersion, trackDownload };
