import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Switch, FormControlLabel, Button, Snackbar, Alert, Grid, Divider } from '@mui/material';
import api from '../api';

function Settings() {
    const [demoMode, setDemoMode] = useState(false);
    const [executionMode, setExecutionMode] = useState('local');
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const res = await api.get('/config');
            setDemoMode(res.data.demoMode);
            setExecutionMode(res.data.executionMode);
        } catch (err) {
            console.error('Failed to fetch config', err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleDemoMode = async (event) => {
        const newValue = event.target.checked;
        setDemoMode(newValue);
        try {
            await api.post('/config/update', { demoMode: newValue });
            setSnackbar({
                open: true,
                message: `Demo Mode turned ${newValue ? 'ON' : 'OFF'}`,
                severity: 'success'
            });
        } catch (err) {
            console.error('Failed to update demo mode', err);
            setSnackbar({
                open: true,
                message: 'Failed to update Demo Mode',
                severity: 'error'
            });
        }
    };

    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    if (loading) return <Box sx={{ p: 4 }}>Loading Settings...</Box>;

    return (
        <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
                System Settings
            </Typography>

            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, borderRadius: 2 }} elevation={3}>
                        <Typography variant="h6" gutterBottom>Presentation & Demo</Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                            Configure AutoTestX for live demonstrations and stage presentations.
                        </Typography>

                        <Divider sx={{ mb: 3 }} />

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={demoMode}
                                    onChange={handleToggleDemoMode}
                                    color="primary"
                                />
                            }
                            label={
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Demo Mode</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        When enabled: Sample tests are auto-generated if none exist, and the dashboard will show enhanced animations during execution.
                                    </Typography>
                                </Box>
                            }
                        />
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Paper sx={{ p: 3, borderRadius: 2 }} elevation={3}>
                        <Typography variant="h6" gutterBottom>Execution Configuration</Typography>
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body2">
                                <strong>Current Mode:</strong> {executionMode.toUpperCase()}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                                You can change this on the Dashboard or via environment variables.
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default Settings;
