const express = require('express');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const {
    getSectors,
    createSector,
    deleteSector,
    getModalities,
    createModality,
    deleteModality
} = require('../controllers/classificationController');

const router = express.Router();

// Public read access for filters
router.get('/sectors', getSectors);
router.get('/modalities', getModalities);

// Admin only write access
router.post('/sectors', authenticate, authorize(['ADMIN']), createSector);
router.delete('/sectors/:id', authenticate, authorize(['ADMIN']), deleteSector);

router.post('/modalities', authenticate, authorize(['ADMIN']), createModality);
router.delete('/modalities/:id', authenticate, authorize(['ADMIN']), deleteModality);

module.exports = router;
