import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import api from '../api';

function TestCases() {
    const [tests, setTests] = useState([]);
    const [prioritizedTests, setPrioritizedTests] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState({
        testName: '',
        filePath: '',
        failureRate: '',
        executionTime: '',
        riskScore: ''
    });

    const fetchTests = async () => {
        try {
            const res = await api.get('/tests');
            setTests(res.data);
        } catch (err) {
            console.error('Failed to fetch tests', err);
        }
    };

    const handlePrioritize = async () => {
        try {
            const res = await api.post('/ai/prioritize');
            setPrioritizedTests(res.data);
            setIsModalOpen(true);
        } catch (err) {
            console.error('Failed to prioritize tests', err);
        }
    };

    useEffect(() => {
        fetchTests();
    }, []);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const payload = {
            testName: form.testName,
            filePath: form.filePath,
            failureRate: Number(form.failureRate),
            executionTime: Number(form.executionTime),
            riskScore: Number(form.riskScore) || 0
        };
        try {
            await api.post('/tests/add', payload);
            setForm({ testName: '', filePath: '', failureRate: '', executionTime: '', riskScore: '' });
            fetchTests();
        } catch (err) {
            console.error('Failed to add test', err);
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4">
                    Test Cases Management
                </Typography>
                <Button variant="contained" color="secondary" onClick={handlePrioritize}>
                    Prioritize Tests (AI)
                </Button>
            </Box>
            <Paper sx={{ p: 2, mb: 4 }} elevation={3}>
                <form onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField label="Test Name" name="testName" value={form.testName} onChange={handleChange} required />
                        <TextField label="File Path" name="filePath" value={form.filePath} onChange={handleChange} required />
                        <TextField label="Failure Rate" name="failureRate" type="number" value={form.failureRate} onChange={handleChange} required />
                        <TextField label="Execution Time (ms)" name="executionTime" type="number" value={form.executionTime} onChange={handleChange} required />
                        <TextField label="Risk Score" name="riskScore" type="number" value={form.riskScore} onChange={handleChange} />
                        <Button type="submit" variant="contained" color="primary">
                            Add Test Case
                        </Button>
                    </Box>
                </form>
            </Paper>
            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Test Name</TableCell>
                            <TableCell>File Path</TableCell>
                            <TableCell>Failure Rate</TableCell>
                            <TableCell>Execution Time (ms)</TableCell>
                            <TableCell>Risk Score</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tests.map(test => (
                            <TableRow key={test._id}>
                                <TableCell>{test.testName}</TableCell>
                                <TableCell>{test.filePath}</TableCell>
                                <TableCell>{test.failureRate}</TableCell>
                                <TableCell>{test.executionTime}</TableCell>
                                <TableCell>{test.riskScore}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* AI Prioritization Modal */}
            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>AI Recommended Test Order</DialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom variant="body2" color="textSecondary">
                        The AI has sorted your tests based on the Risk Score to ensure the most critical tests run first.
                    </Typography>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Priority</TableCell>
                                    <TableCell>Test Name</TableCell>
                                    <TableCell>Risk Score</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {prioritizedTests.map((test, index) => (
                                    <TableRow key={test._id}>
                                        <TableCell><strong>#{index + 1}</strong></TableCell>
                                        <TableCell>{test.testName}</TableCell>
                                        <TableCell>{test.riskScore}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsModalOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default TestCases;
