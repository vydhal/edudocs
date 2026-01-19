const express = require('express');
const multer = require('multer');
const path = require('path');
const { getSettings, updateSettings, uploadLogo } = require('../controllers/settingController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Multer setup for logo uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, 'logo-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.get('/', getSettings); // Public
router.post('/', authenticate, authorize(['ADMIN']), updateSettings);
router.post('/logo', authenticate, authorize(['ADMIN']), upload.single('file'), uploadLogo);

module.exports = router;
