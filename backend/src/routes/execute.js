const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const axios = require('axios');
const Test = require('../models/Test');
const Run = require('../models/Run');
const Project = require('../models/Project');
const { runInDocker } = require('../utils/docker-runner');
const { simulateLocalExecution } = require('../utils/local-runner');
const { runProjectTests } = require('../utils/project-integrator');
const { normalizeResult } = require('../utils/result-normalizer');
const configRoutes = require('./config');

// POST /execute/run - prioritize tests with AI then execute them locally
router.post('/run', async (req, res) => {
    try {
        const { projectId, commitId, branch } = req.body;
        const { executionMode, demoMode } = configRoutes.getCurrentConfig();

        let tests = [];
        let isProjectRun = false;

        if (projectId) {
            const project = await Project.findById(projectId);
            if (!project) return res.status(404).json({ error: 'Project not found' });

            console.log(`[EXECUTE] Running tests for project: ${project.name} | Branch: ${branch || 'N/A'} | Commit: ${commitId || 'N/A'}`);
            const results = await runProjectTests(project);

            // For custom project runs, we create a run entry immediately
            const passedCount = results.filter(r => r.status === 'passed').length;
            const failedCount = results.filter(r => r.status === 'failed').length;
            const totalDuration = results.reduce((acc, r) => acc + r.duration, 0);

            const newRun = new Run({
                totalTests: results.length,
                passedCount,
                failedCount,
                duration: totalDuration,
                executionMode: 'External Project',
                runnerType: 'Custom-Integrator',
                projectId: project._id,
                commitId: commitId || 'manual',
                branch: branch || 'unknown',
                results: results.map((r, idx) => normalizeResult({
                    ...r,
                    orderIndex: r.executionOrder || idx + 1
                }))
            });

            await newRun.save();

            // Update project status
            const qualityScore = results.length > 0 ? Math.round((passedCount / results.length) * 100) : 0;
            project.lastRunStatus = failedCount > 0 ? 'failed' : 'passed';
            project.lastRunTime = new Date();
            project.qualityScore = qualityScore;
            await project.save();

            return res.json({
                summary: `Successfully executed project suite for ${project.name}.`,
                passed: passedCount,
                failed: failedCount,
                totalDuration: `${totalDuration}ms`,
                details: results,
                runId: newRun._id
            });
        }

        // Default logic for global tests
        tests = await Test.find();

        if (tests.length === 0) {
            if (demoMode) {
                console.log('Demo Mode ON: Generating sample tests for simulation...');
                tests = [
                    { _id: new mongoose.Types.ObjectId(), testName: 'Login Authentication', filePath: 'tests/login.js', riskScore: 8.5 },
                    { _id: new mongoose.Types.ObjectId(), testName: 'Payment Gateway', filePath: 'tests/payment.js', riskScore: 9.2 },
                    { _id: new mongoose.Types.ObjectId(), testName: 'User Profile Update', filePath: 'tests/profile.js', riskScore: 4.1 },
                    { _id: new mongoose.Types.ObjectId(), testName: 'Search Functionality', filePath: 'tests/search.js', riskScore: 6.3 },
                    { _id: new mongoose.Types.ObjectId(), testName: 'Checkout Flow', filePath: 'tests/checkout.js', riskScore: 7.8 }
                ];
            } else {
                return res.status(400).json({ error: 'No tests available to run' });
            }
        }

        // 2. Call AI Priority Service to get a sorted list
        let prioritizedTests;
        try {
            // For sample tests, skip AI call or handle it
            if (demoMode && tests.length > 0 && tests[0].riskScore) {
                prioritizedTests = [...tests].sort((a, b) => b.riskScore - a.riskScore);
            } else {
                const aiResponse = await axios.post('http://localhost:8000/prioritize', tests);
                prioritizedTests = aiResponse.data;
            }
            console.log('Tests prioritized.');
        } catch (aiErr) {
            console.warn('AI Service unavailable, falling back to database order.', aiErr.message);
            prioritizedTests = tests;
        }

        // 3. Execute tests using the configured runner (in prioritized order)
        console.log(`Running tests in ${executionMode.toUpperCase()} mode...`);
        const runner = executionMode === 'docker' ? runInDocker : simulateLocalExecution;
        const results = await runner(prioritizedTests);

        // 4. Calculate summary statistics
        const passedCount = results.filter(r => r.status === 'passed').length;
        const failedCount = results.filter(r => r.status === 'failed').length;
        const totalDuration = results.reduce((acc, r) => acc + r.duration, 0);

        // 5. Update Learning Loop Metrics (Persistent Tests)
        if (!demoMode) {
            for (const resItem of results) {
                if (resItem.testId) {
                    const testDoc = await Test.findById(resItem.testId);
                    if (testDoc) {
                        testDoc.totalRuns += 1;
                        if (resItem.status === 'failed') testDoc.totalFailures += 1;
                        testDoc.failureRate = testDoc.totalFailures / testDoc.totalRuns;
                        testDoc.lastRunStatus = resItem.status;
                        testDoc.executionTime = resItem.duration;
                        // riskScore is updated by AI Prioritization service, 
                        // but we cache the latest run duration/status
                        await testDoc.save();
                    }
                }
            }
        }

        // 6. Store the run history in MongoDB
        const newRun = new Run({
            totalTests: prioritizedTests.length,
            passedCount,
            failedCount,
            duration: totalDuration,
            executionMode: 'AI-Priority',
            runnerType: executionMode,
            results: results.map((r, idx) => normalizeResult({
                ...r,
                orderIndex: r.executionOrder || idx + 1
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
