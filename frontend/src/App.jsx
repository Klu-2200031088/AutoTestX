import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import TestCases from './pages/TestCases';
import Dashboard from './pages/Dashboard';
import RunHistory from './pages/RunHistory';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Button, Container, Box, Typography } from '@mui/material';

function App() {
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
                        <Button color="inherit" component={RouterLink} to="/">Home</Button>
                        <Button color="inherit" component={RouterLink} to="/dashboard">Dashboard</Button>
                        <Button color="inherit" component={RouterLink} to="/tests">Test Cases</Button>
                        <Button color="inherit" component={RouterLink} to="/history">Run History</Button>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Pipeline Status:</Typography>
                        <img
                            src="https://img.shields.io/badge/CI-Success-brightgreen?style=flat-square&logo=github-actions"
                            alt="CI Status"
                            style={{ height: '24px' }}
                        />
                    </Box>
                </Toolbar>
            </AppBar>
            <Container sx={{ mt: 4 }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/tests" element={<TestCases />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/history" element={<RunHistory />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Container>
        </>
    );
}

export default App;
