const express = require('express');
const { getStats } = require('../controllers/analyticsController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticate, authorize(['ADMIN']), getStats);

module.exports = router;
