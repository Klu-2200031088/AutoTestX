const mongoose = require('mongoose');

const TestResultSchema = new mongoose.Schema({
    testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' },
    testName: String,
    status: { type: String, enum: ['passed', 'failed'] },
    executionOrder: Number,
    runAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TestResult', TestResultSchema);
