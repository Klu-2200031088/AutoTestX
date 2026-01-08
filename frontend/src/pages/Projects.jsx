import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Box, Paper, TextField, Button, Grid, Card, CardContent,
    CardActions, IconButton, Chip, Divider, CircularProgress, Alert, LinearProgress
} from '@mui/material';
import { Add, Delete, PlayArrow, GitHub, Storage, HelpOutline } from '@mui/icons-material';
import axios from 'axios';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [runningId, setRunningId] = useState(null);
    const [error, setError] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        repoUrl: '',
        testCommand: 'npm test'
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/projects');
            setProjects(res.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to load projects.");
            setLoading(false);
        }
    };

    const handleAddProject = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/projects', formData);
            setFormData({ name: '', repoUrl: '', testCommand: 'npm test' });
            fetchProjects();
        } catch (err) {
            setError("Failed to add project.");
        }
    };

    const handleDeleteProject = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/projects/${id}`);
            fetchProjects();
        } catch (err) {
            setError("Failed to delete project.");
        }
    };

    const handleRunProject = async (id) => {
        setRunningId(id);
        setError(null);
        try {
            const res = await axios.post('http://localhost:5000/api/execute/run', { projectId: id });
            setRunningId(null);
            alert(`Execution Complete: ${res.data.summary}`);
        } catch (err) {
            setError("Pipeline execution failed.");
            setRunningId(null);
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                    Project Integration
                </Typography>
                <Chip icon={<GitHub />} label="GitHub Sync Ready" color="success" variant="outlined" />
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <Grid container spacing={4}>
                {/* New Project Form */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Add color="primary" /> Onboard New Project
                        </Typography>
                        <Divider sx={{ mb: 3 }} />
                        <form onSubmit={handleAddProject}>
                            <TextField
                                fullWidth label="Project Name" variant="outlined" sx={{ mb: 2 }} required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                            <TextField
                                fullWidth label="Repository URL" placeholder="https://github.com/user/repo"
                                variant="outlined" sx={{ mb: 2 }}
                                value={formData.repoUrl}
                                onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                            />
                            <TextField
                                fullWidth label="Test Command" variant="outlined" sx={{ mb: 3 }}
                                value={formData.testCommand}
                                onChange={(e) => setFormData({ ...formData, testCommand: e.target.value })}
                            />
                            <Button
                                type="submit" variant="contained" fullWidth sx={{ py: 1.5, borderRadius: 2 }}
                                startIcon={<Storage />}
                            >
                                Register Project
                            </Button>
                        </form>
                    </Paper>
                </Grid>

                {/* Project List */}
                <Grid item xs={12} md={8}>
                    <Grid container spacing={2}>
                        {projects.length === 0 ? (
                            <Grid item xs={12}>
                                <Paper sx={{ p: 5, textAlign: 'center', border: '1px dashed #ccc' }}>
                                    <HelpOutline sx={{ fontSize: 40, color: 'text.secondary', mb: 2 }} />
                                    <Typography color="text.secondary">No projects integrated yet.</Typography>
                                </Paper>
                            </Grid>
                        ) : (
                            projects.map((proj) => (
                                <Grid item xs={12} key={proj._id}>
                                    <Card sx={{
                                        borderRadius: 2,
                                        transition: '0.3s',
                                        '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.1)' },
                                        borderLeft: '5px solid #3f51b5'
                                    }}>
                                        <CardContent sx={{ pb: 1 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{proj.name}</Typography>
                                                <Chip label="ACTIVE" size="small" color="info" />
                                            </Box>
                                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <GitHub fontSize="small" /> {proj.repoUrl || 'Local Source'}
                                            </Typography>
                                            <Typography variant="caption" sx={{ mt: 1, display: 'block', bgcolor: '#f5f5f5', p: 0.5, borderRadius: 1 }}>
                                                Command: <code>{proj.testCommand}</code>
                                            </Typography>

                                            <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                                                <Typography variant="caption" color="text.secondary">
                                                    ID: <strong>{proj._id}</strong>
                                                </Typography>
                                                <Chip
                                                    label={proj.lastRunStatus?.toUpperCase() || 'NEVER RUN'}
                                                    size="small"
                                                    color={proj.lastRunStatus === 'passed' ? 'success' : (proj.lastRunStatus === 'failed' ? 'error' : 'default')}
                                                    sx={{ height: 20, fontSize: '0.65rem' }}
                                                />
                                                {proj.lastRunTime && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        Last Run: {new Date(proj.lastRunTime).toLocaleString()}
                                                    </Typography>
                                                )}
                                            </Box>

                                            {proj.lastRunStatus !== 'never' && (
                                                <Box sx={{ mt: 2 }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Quality Score</Typography>
                                                        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>{proj.qualityScore || 0}%</Typography>
                                                    </Box>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={proj.qualityScore || 0}
                                                        color={proj.qualityScore > 80 ? 'success' : (proj.qualityScore > 50 ? 'warning' : 'error')}
                                                        sx={{ height: 6, borderRadius: 3 }}
                                                    />
                                                </Box>
                                            )}

                                            {runningId === proj._id && (
                                                <Box sx={{ width: '100%', mt: 2 }}>
                                                    <LinearProgress />
                                                    <Typography variant="caption" color="primary">Executing Intelligence Pipeline...</Typography>
                                                </Box>
                                            )}
                                        </CardContent>
                                        <CardActions sx={{ px: 2, pb: 2 }}>
                                            <Button
                                                size="small" variant="contained" color="success"
                                                startIcon={<PlayArrow />}
                                                onClick={() => handleRunProject(proj._id)}
                                                disabled={runningId !== null}
                                            >
                                                Run Suite
                                            </Button>
                                            <IconButton color="error" size="small" onClick={() => handleDeleteProject(proj._id)}>
                                                <Delete />
                                            </IconButton>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))
                        )}
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Projects;
