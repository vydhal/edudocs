const express = require('express');
const multer = require('multer');
const path = require('path');
const {
    createSuggestion,
    getAllSuggestions,
    updateSuggestionStatus,
    deleteSuggestion
} = require('../controllers/suggestionController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Multer setup - same as documentRoutes for public uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Public route to suggest a document
router.post('/', upload.single('file'), createSuggestion);

// Protected routes for admin management
router.get('/', authenticate, authorize(['ADMIN', 'EDITOR']), getAllSuggestions);
router.put('/:id/status', authenticate, authorize(['ADMIN', 'EDITOR']), updateSuggestionStatus);
router.delete('/:id', authenticate, authorize(['ADMIN']), deleteSuggestion);

module.exports = router;
