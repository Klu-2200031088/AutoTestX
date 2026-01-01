const mongoose = require('mongoose');

const RunSchema = new mongoose.Schema({
    totalTests: Number,
    passedCount: Number,
    failedCount: Number,
    duration: Number, // total execution time in ms
    executionMode: String,
    results: [
        {
            testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' },
            testName: String,
            status: String,
            orderIndex: Number,
            duration: Number, // duration per test
            logs: String // simulated logs
        }
    ],
    runAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Run', RunSchema);
