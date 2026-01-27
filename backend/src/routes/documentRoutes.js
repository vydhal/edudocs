const express = require('express');
const multer = require('multer');
const path = require('path');
const { getAllDocuments, uploadDocument, deleteDocument, getDocumentVersions, exportDocuments, createDocumentVersion, trackDownload } = require('../controllers/documentController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.get('/export', authenticate, authorize(['ADMIN']), exportDocuments);
router.get('/', getAllDocuments);
router.post('/', authenticate, upload.single('file'), uploadDocument);
router.post('/:id/version', authenticate, upload.single('file'), createDocumentVersion);
router.post('/:id/download', trackDownload);
router.get('/:id/versions', authenticate, getDocumentVersions);
router.delete('/:id', authenticate, authorize(['ADMIN', 'EDITOR']), deleteDocument);

module.exports = router;
