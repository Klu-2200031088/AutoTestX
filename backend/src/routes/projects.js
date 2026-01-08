const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Test = require('../models/Test');

// GET /api/projects - Get all projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

// POST /api/projects - Create a new project
router.post('/', async (req, res) => {
    try {
        const { name, repoUrl, localPath, installCommand, testCommand } = req.body;
        const newProject = new Project({
            name,
            repoUrl,
            localPath,
            installCommand,
            testCommand
        });
        await newProject.save();
        res.status(201).json(newProject);
    } catch (err) {
        res.status(400).json({ error: 'Failed to create project' });
    }
});

// GET /api/projects/:id - Get project details
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch project' });
    }
});

// DELETE /api/projects/:id - Remove a project
router.delete('/:id', async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        // Also delete associated tests
        await Test.deleteMany({ projectId: req.params.id });
        res.json({ message: 'Project and associated tests deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

module.exports = router;
