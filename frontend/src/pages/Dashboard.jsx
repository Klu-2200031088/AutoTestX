import React, { useState } from 'react';
import { Box, Typography, Button, Paper, List, ListItem, ListItemText, Snackbar, Alert } from '@mui/material';
import api from '../api';

function Dashboard() {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    const runTests = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.post('/execute/run');
            setResult(res.data);
            setSnackbar({
                open: true,
                message: `Success: ${res.data.summary} (${res.data.passed} Passed, ${res.data.failed} Failed)`,
                severity: 'success'
            });
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

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={runTests}
                disabled={loading}
                size="large"
            >
                {loading ? 'Executing Suite...' : 'Run Test Suite'}
            </Button>

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
                <Typography color="error" sx={{ mt: 2 }}>
                    {error}
                </Typography>
            )}

            {result && (
                <Paper sx={{ mt: 4, p: 3 }} elevation={3}>
                    <Typography variant="overline" color="primary" sx={{ fontWeight: 'bold' }}>
                        Execution mode: AI Prioritized Run
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Execution Details
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 2 }}>
                        {result.summary} (Duration: {result.totalDuration})
                    </Typography>
                    <List>
                        {result.details.map((test, idx) => (
                            <ListItem key={idx} divider>
                                <ListItemText
                                    primary={`${test.executionOrder}. ${test.testName}`}
                                    secondary={test.status}
                                    secondaryTypographyProps={{
                                        color: test.status === 'passed' ? 'success.main' : 'error.main',
                                        fontWeight: 'bold'
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            )}
        </Box>
    );
}

export default Dashboard;
