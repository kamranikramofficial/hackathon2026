const express = require('express');
const router = express.Router();
const { diagnoseSymptoms, getDiagnosisLogs } = require('../controllers/aiController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/diagnose', protect, authorize('Doctor'), diagnoseSymptoms);
router.get('/logs', protect, authorize('Admin', 'Doctor'), getDiagnosisLogs);

module.exports = router;
