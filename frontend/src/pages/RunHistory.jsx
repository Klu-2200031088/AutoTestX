import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import api from '../api';

function RunHistory() {
    const [runs, setRuns] = useState([]);
    const [selectedRun, setSelectedRun] = useState(null);
    const [open, setOpen] = useState(false);

    const fetchHistory = async () => {
        try {
            const res = await api.get('/execute/history');
            setRuns(res.data);
        } catch (err) {
            console.error('Failed to fetch history', err);
        }
    };

    const viewDetails = async (id) => {
        try {
            const res = await api.get(`/execute/history/${id}`);
            setSelectedRun(res.data);
            setOpen(true);
        } catch (err) {
            console.error('Failed to fetch details', err);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
                Run History
            </Typography>
            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Run ID</TableCell>
                            <TableCell>Date / Time</TableCell>
                            <TableCell>Total Tests</TableCell>
                            <TableCell>Passed / Failed</TableCell>
                            <TableCell>Duration (ms)</TableCell>
                            <TableCell>Mode</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {runs.map(run => (
                            <TableRow key={run._id}>
                                <TableCell sx={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>
                                    {run._id.substring(run._id.length - 8).toUpperCase()}
                                </TableCell>
                                <TableCell>{new Date(run.runAt).toLocaleString()}</TableCell>
                                <TableCell>{run.totalTests}</TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Typography sx={{ color: 'success.main', fontWeight: 'bold' }}>{run.passedCount} P</Typography>
                                        <Typography sx={{ color: 'error.main', fontWeight: 'bold' }}>{run.failedCount} F</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>{run.duration}</TableCell>
                                <TableCell>
                                    <Typography variant="caption" sx={{ bgcolor: run.executionMode === 'AI-Priority' ? 'secondary.main' : 'primary.light', p: 0.5, borderRadius: 1, color: 'white', fontWeight: 'bold' }}>
                                        {run.executionMode || 'Local'}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Button variant="outlined" size="small" onClick={() => viewDetails(run._id)}>View Details</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Run Details & Logs</DialogTitle>
                <DialogContent dividers>
                    {selectedRun && (
                        <Box>
                            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="subtitle1">
                                    <strong>Executed on:</strong> {new Date(selectedRun.runAt).toLocaleString()}
                                </Typography>
                                <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold' }}>
                                    Total Duration: {selectedRun.duration}ms
                                </Typography>
                            </Box>
                            <Box sx={{ mt: 2 }}>
                                {selectedRun.results.map((res, idx) => (
                                    <Paper key={idx} sx={{ p: 2, mb: 2, borderLeft: `5px solid ${res.status === 'passed' ? '#4caf50' : '#f44336'}` }} elevation={1}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                {res.orderIndex}. {res.testName}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: res.status === 'passed' ? 'success.main' : 'error.main', fontWeight: 'bold' }}>
                                                {res.status.toUpperCase()} ({res.duration || 0}ms)
                                            </Typography>
                                        </Box>
                                        <Box
                                            component="pre"
                                            sx={{
                                                mt: 1,
                                                p: 1.5,
                                                bgcolor: '#1e1e1e',
                                                color: '#d4d4d4',
                                                borderRadius: 1,
                                                whiteSpace: 'pre-wrap',
                                                fontFamily: 'monospace',
                                                fontSize: '0.75rem',
                                                maxHeight: '150px',
                                                overflowY: 'auto'
                                            }}
                                        >
                                            {res.logs}
                                        </Box>
                                    </Paper>
                                ))}
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default RunHistory;
