import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, List, ListItem, ListItemText, Snackbar, Alert, FormControl, InputLabel, Select, MenuItem, CircularProgress, Grid, Divider, Chip, LinearProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { PlayArrow, Science, Speed, Animation } from '@mui/icons-material';
import api from '../api';

const COLORS = ['#4caf50', '#f44336'];

function Dashboard() {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [configLoading, setConfigLoading] = useState(true);
    const [executionMode, setExecutionMode] = useState('local');
    const [demoMode, setDemoMode] = useState(false);
    const [history, setHistory] = useState([]);
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const [demoProgress, setDemoProgress] = useState(0);
    const [demoStep, setDemoStep] = useState('');

    useEffect(() => {
        fetchConfig();
        fetchHistory();
    }, []);

    const fetchConfig = async () => {
        try {
            const res = await api.get('/config');
            setExecutionMode(res.data.executionMode);
            setDemoMode(res.data.demoMode);
        } catch (err) {
            console.error('Failed to fetch config', err);
        } finally {
            setConfigLoading(false);
        }
    };

    const fetchHistory = async () => {
        try {
            const res = await api.get('/execute/history');
            // Backend returns runs sorted by runAt desc, let's reverse for chronological line/bar charts
            setHistory(res.data.reverse());
        } catch (err) {
            console.error('Failed to fetch history', err);
        }
    };

    const handleModeChange = async (event) => {
        const newMode = event.target.value;
        setExecutionMode(newMode);
        try {
            await api.post('/config/update', { executionMode: newMode });
            setSnackbar({
                open: true,
                message: `Execution Mode updated to ${newMode.toUpperCase()}`,
                severity: 'info'
            });
        } catch (err) {
            console.error('Failed to update config', err);
            setSnackbar({
                open: true,
                message: 'Error: Failed to update execution mode',
                severity: 'error'
            });
        }
    };

    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    const runTests = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        if (demoMode) {
            // Enhanced Demo Animation
            const steps = [
                { msg: 'Initializing Intelligent Agent...', delay: 800, progress: 10 },
                { msg: 'Analyzing codebase risk vectors...', delay: 1200, progress: 30 },
                { msg: 'Calculating AI priority matrix...', delay: 1000, progress: 50 },
                { msg: 'Spinning up isolated Docker containers...', delay: 1500, progress: 75 },
                { msg: 'Executing critical test path...', delay: 1000, progress: 95 }
            ];

            for (const step of steps) {
                setDemoStep(step.msg);
                setDemoProgress(step.progress);
                await new Promise(r => setTimeout(r, step.delay));
            }
        }

        try {
            const res = await api.post('/execute/run');
            setResult(res.data);
            setSnackbar({
                open: true,
                message: `Success: ${res.data.summary} (${res.data.passed} Passed, ${res.data.failed} Failed)`,
                severity: 'success'
            });
            fetchHistory(); // Refresh charts after run
        } catch (err) {
            console.error('Run tests failed', err);
            setError('Failed to run tests');
            setSnackbar({
                open: true,
                message: 'Error: Failed to run test suite',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    // Prepare chart data
    const barData = history.slice(-10).map((run, idx) => ({
        name: `Run ${history.length - history.slice(-10).length + idx + 1}`,
        passed: run.passedCount,
        failed: run.failedCount,
    }));

    const lineData = history.slice(-10).map((run, idx) => ({
        name: `Run ${history.length - history.slice(-10).length + idx + 1}`,
        duration: run.duration,
    }));

    const latestRun = history[history.length - 1];
    const pieData = latestRun ? [
        { name: 'Passed', value: latestRun.passedCount },
        { name: 'Failed', value: latestRun.failedCount },
    ] : [];

    return (
        <Box sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        Dashboard
                    </Typography>
                    {demoMode && (
                        <Chip
                            icon={<Animation />}
                            label="DEMO MODE ACTIVE"
                            color="primary"
                            variant="filled"
                            size="small"
                            sx={{ fontWeight: 'bold', animation: 'pulse 2s infinite' }}
                        />
                    )}
                </Box>

                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <FormControl sx={{ minWidth: 180 }} size="small" disabled={configLoading || loading}>
                        <InputLabel id="execution-mode-label">Execution Mode</InputLabel>
                        <Select
                            labelId="execution-mode-label"
                            id="execution-mode-select"
                            value={executionMode}
                            label="Execution Mode"
                            onChange={handleModeChange}
                        >
                            <MenuItem value="local">Local Simulation</MenuItem>
                            <MenuItem value="docker">Dockerized Runner</MenuItem>
                        </Select>
                    </FormControl>

                    <Button
                        variant="contained"
                        onClick={runTests}
                        disabled={loading || configLoading}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PlayArrow />}
                        sx={{
                            px: 4, py: 1,
                            borderRadius: 2,
                            boxShadow: '0 4px 14px rgba(33, 150, 243, 0.4)'
                        }}
                    >
                        {loading ? 'Processing...' : 'Run Test Suite'}
                    </Button>
                </Box>
            </Box>

            {loading && demoMode && (
                <Paper sx={{ p: 3, mb: 4, textAlign: 'center', bgcolor: 'rgba(33, 150, 243, 0.05)', border: '1px dashed #2196f3' }}>
                    <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold', mb: 1 }}>
                        {demoStep}
                    </Typography>
                    <LinearProgress variant="determinate" value={demoProgress} sx={{ height: 10, borderRadius: 5 }} />
                </Paper>
            )}

            <Grid container spacing={3}>
                {/* Statistics Overview */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, height: 350, borderRadius: 3 }} elevation={2}>
                        <Typography variant="h6" gutterBottom color="textSecondary">
                            Test Results Trend (Last 10 Runs)
                        </Typography>
                        <ResponsiveContainer width="100%" height="90%">
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" fontSize={12} />
                                <YAxis fontSize={12} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="passed" fill="#4caf50" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="failed" fill="#f44336" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, height: 350, borderRadius: 3, display: 'flex', flexDirection: 'column' }} elevation={2}>
                        <Typography variant="h6" gutterBottom color="textSecondary">
                            Latest Run Success Rate
                        </Typography>
                        <Box sx={{ flexGrow: 1 }}>
                            {pieData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Typography color="textSecondary">No data available</Typography>
                                </Box>
                            )}
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Paper sx={{ p: 3, height: 300, borderRadius: 3 }} elevation={2}>
                        <Typography variant="h6" gutterBottom color="textSecondary">
                            Execution Duration Trend (ms)
                        </Typography>
                        <ResponsiveContainer width="100%" height="90%">
                            <LineChart data={lineData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" fontSize={12} />
                                <YAxis fontSize={12} />
                                <Tooltip />
                                <Line type="monotone" dataKey="duration" stroke="#2196f3" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Execution Result Modal-like view */}
                {result && (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3, borderRadius: 3, borderLeft: '6px solid', borderColor: 'primary.main' }} elevation={3}>
                            <Typography variant="overline" color="primary" sx={{ fontWeight: 'bold' }}>
                                Latest Execution Summary
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                        {result.summary}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Total Duration: {result.totalDuration} | Mode: AI Prioritized
                                    </Typography>
                                </Box>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Grid container spacing={2}>
                                {result.details.map((test, idx) => (
                                    <Grid item xs={12} sm={6} md={4} key={idx}>
                                        <Box sx={{ p: 1, px: 2, bgcolor: 'background.default', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                            <Typography variant="subtitle2" noWrap>
                                                {test.executionOrder}. {test.testName}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: test.status === 'passed' ? 'success.main' : 'error.main',
                                                    fontWeight: 'bold',
                                                    textTransform: 'uppercase'
                                                }}
                                            >
                                                {test.status}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    </Grid>
                )}
            </Grid>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {error && (
                <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>
                    {error}
                </Alert>
            )}
        </Box>
    );
}

export default Dashboard;
