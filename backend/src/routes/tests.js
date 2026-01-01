const express = require('express');
const router = express.Router();
const Test = require('../models/Test');

// POST /tests/add - Add a new test case
router.post('/add', async (req, res) => {
    try {
        const { testName, filePath, failureRate, executionTime, riskScore } = req.body;
        const newTest = new Test({ testName, filePath, failureRate, executionTime, riskScore });
        await newTest.save();
        res.status(201).json({ message: 'Test case added', test: newTest });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /tests - Retrieve all test cases
router.get('/', async (req, res) => {
    try {
        const tests = await Test.find();
        res.json(tests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
