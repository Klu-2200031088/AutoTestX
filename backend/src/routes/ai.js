const express = require('express');
const router = express.Router();
const axios = require('axios');
const Test = require('../models/Test');

// POST /api/ai/prioritize - Forwards test case list to FastAPI AI service
router.post('/prioritize', async (req, res) => {
    try {
        let tests = req.body.tests;

        // If no tests provided in body, fetch from database as fallback
        if (!tests || !Array.isArray(tests)) {
            tests = await Test.find();
        }

        if (!tests || tests.length === 0) {
            return res.status(400).json({ error: 'No test cases provided or found' });
        }

        // Forward to Python FastAPI service (ai-service)
        const aiResponse = await axios.post('http://localhost:8000/prioritize', tests);

        res.json(aiResponse.data);
    } catch (err) {
        console.error('AI Service Error:', err.message);
        res.status(500).json({ error: 'Failed to prioritize tests via AI service. Ensure ai-service is running on port 8000.' });
    }
});

module.exports = router;
