const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
  testName: { type: String, required: true },
  filePath: { type: String, required: true },
  failureRate: { type: Number, required: true },
  executionTime: { type: Number, required: true }, // in milliseconds
  riskScore: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Test', TestSchema);
