const express = require('express');
const router = express.Router();
const axios = require('axios');
const Test = require('../models/Test');
const Run = require('../models/Run');
const { runInDocker } = require('../utils/docker-runner');
const { simulateLocalExecution } = require('../utils/local-runner');

const EXECUTION_MODE = process.env.EXECUTION_MODE || 'local';

// POST /execute/run - prioritize tests with AI then execute them locally
router.post('/run', async (req, res) => {
    try {
        // 1. Fetch all tests from database
        const tests = await Test.find();
        if (tests.length === 0) {
            return res.status(400).json({ error: 'No tests available to run' });
        }

        // 2. Call AI Priority Service to get a sorted list
        let prioritizedTests;
        try {
            const aiResponse = await axios.post('http://localhost:8000/prioritize', tests);
            prioritizedTests = aiResponse.data;
            console.log('Tests prioritized by AI service.');
        } catch (aiErr) {
            console.warn('AI Service unavailable, falling back to database order.', aiErr.message);
            prioritizedTests = tests;
        }

        // 3. Execute tests using the local runner utility (in prioritized order)
        const results = await simulateLocalExecution(prioritizedTests);

        // 4. Calculate summary statistics
        const passedCount = results.filter(r => r.status === 'passed').length;
        const failedCount = results.filter(r => r.status === 'failed').length;
        const totalDuration = results.reduce((acc, r) => acc + r.duration, 0);

        // 5. Store the run history in MongoDB
        const newRun = new Run({
            totalTests: prioritizedTests.length,
            passedCount,
            failedCount,
            duration: totalDuration,
            executionMode: 'AI-Priority',
            results: results.map(r => ({
                testId: r.testId,
                testName: r.testName,
                status: r.status,
                orderIndex: r.executionOrder,
                duration: r.duration,
                logs: r.logs
            }))
        });

        await newRun.save();

        // 6. Special CI Logging if applicable
        const isCI = process.env.IS_CI === 'true';
        if (isCI) {
            console.log('\n================ CI EXECUTION SUMMARY ================');
            console.log(`Status: COMPLETED`);
            console.log(`Total Tests: ${prioritizedTests.length}`);
            console.log(`Passed: ${passedCount}`);
            console.log(`Failed: ${failedCount}`);
            console.log(`Duration: ${totalDuration}ms`);
            console.log(`Execution Mode: AI-Priority`);
            console.log('======================================================\n');
        }

        // 7. Return execution summary
        res.json({
            message: isCI ? "CI EXECUTION COMPLETED" : undefined,
            summary: `Successfully executed ${prioritizedTests.length} tests in AI-prioritized order.`,
            passed: passedCount,
            failed: failedCount,
            totalDuration: `${totalDuration}ms`,
            details: results,
            runId: newRun._id
        });
    } catch (err) {
        console.error('Execution Error:', err);
        res.status(500).json({ error: 'Failed to execute tests' });
    }
});

// GET /execute/history - get all test runs
router.get('/history', async (req, res) => {
    try {
        const runs = await Run.find().sort({ runAt: -1 }).select('-results'); // skip internal results for list
        res.json(runs);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

// GET /execute/history/:id - get specific run details
router.get('/history/:id', async (req, res) => {
    try {
        const run = await Run.findById(req.params.id);
        if (!run) return res.status(404).json({ error: 'Run not found' });
        res.json(run);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch run details' });
    }
});

module.exports = router;
