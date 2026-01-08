const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    repoUrl: { type: String }, // Optional for local directories
    localPath: { type: String }, // For local integration
    branch: { type: String, default: 'main' },
    installCommand: { type: String, default: 'npm install' },
    testCommand: { type: String, default: 'npm test' },
    environment: { type: Map, of: String },
    lastScanAt: { type: Date },
    lastRunStatus: { type: String, default: 'never' },
    lastRunTime: { type: Date },
    qualityScore: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
