const express = require('express');
const router = express.Router();

// In-memory config for now. For production, this should be in DB.
let currentConfig = {
    executionMode: process.env.EXECUTION_MODE || 'local',
    demoMode: false
};

// GET /api/config - get current configuration
router.get('/', (req, res) => {
    res.json(currentConfig);
});

// POST /api/config/update - update configuration
router.post('/update', (req, res) => {
    const { executionMode, demoMode } = req.body;

    if (executionMode !== undefined) {
        if (executionMode === 'local' || executionMode === 'docker') {
            currentConfig.executionMode = executionMode;
        } else {
            return res.status(400).json({ error: 'Invalid execution mode. Must be "local" or "docker".' });
        }
    }

    if (demoMode !== undefined) {
        currentConfig.demoMode = !!demoMode;
    }

    console.log(`Backend config updated: Execution Mode: ${currentConfig.executionMode}, Demo Mode: ${currentConfig.demoMode}`);
    res.json({ message: 'Config updated successfully', config: currentConfig });
});

// Helper to get config within other routes
router.getCurrentConfig = () => currentConfig;

module.exports = router;
