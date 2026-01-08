const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
  testName: { type: String, required: true },
  filePath: { type: String, required: true },
  failureRate: { type: Number, default: 0 },
  executionTime: { type: Number, default: 0 }, // in milliseconds
  riskScore: { type: Number, default: 0 },
  totalRuns: { type: Number, default: 0 },
  totalFailures: { type: Number, default: 0 },
  lastRunStatus: { type: String },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' }
}, { timestamps: true });

module.exports = mongoose.model('Test', TestSchema);
