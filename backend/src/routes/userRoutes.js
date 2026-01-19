const express = require('express');
const multer = require('multer');
const path = require('path');
const { getAllUsers, createUser, deleteUser, updateProfile, uploadAvatar } = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Multer setup for avatar uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, 'avatar-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

router.get('/', authenticate, authorize(['ADMIN']), getAllUsers);
router.post('/', authenticate, authorize(['ADMIN']), createUser);
router.delete('/:id', authenticate, authorize(['ADMIN']), deleteUser);

// Profile routes (Authenticated users)
router.put('/profile', authenticate, updateProfile);
router.post('/profile/avatar', authenticate, upload.single('file'), uploadAvatar);

module.exports = router;
