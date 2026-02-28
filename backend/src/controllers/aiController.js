const DiagnosisLog = require('../models/DiagnosisLog');
const { getDiagnosticSuggestions } = require('../utils/aiHelper');

// @desc    Check symptoms with AI and log
// @route   POST /api/ai/diagnose
// @access  Private (Doctor)
const diagnoseSymptoms = async (req, res) => {
    try {
        const { patientId, symptoms } = req.body;
        const doctorId = req.user._id;

        if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
            return res.status(400).json({ message: 'Symptoms array is required' });
        }

        // Call Gemini API wrapper
        const aiResponse = await getDiagnosticSuggestions(symptoms);

        const log = await DiagnosisLog.create({
            patientId,
            doctorId,
            symptoms,
            aiResponse: aiResponse.data,
            riskLevel: aiResponse.riskLevel
        });

        res.status(201).json({
            log,
            aiStatus: aiResponse.success ? 'Success' : 'Fallback (AI Unavailable)'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get diagnosis logs
// @route   GET /api/ai/logs
// @access  Private
const getDiagnosisLogs = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'Doctor') {
            query.doctorId = req.user._id;
        }

        const logs = await DiagnosisLog.find(query)
            .populate('patientId', 'name contact')
            .populate('doctorId', 'name email')
            .sort({ createdAt: -1 });

        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    diagnoseSymptoms,
    getDiagnosisLogs
};
