import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import TestCases from './pages/TestCases';
import Dashboard from './pages/Dashboard';
import RunHistory from './pages/RunHistory';
import Settings from './pages/Settings';
import Projects from './pages/Projects';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Button, Container, Box, Typography } from '@mui/material';

function App() {
    return (
        <>
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    color: 'text.primary'
                }}
            >
                <Toolbar>
                    <Typography
                        variant="h6"
                        component={RouterLink}
                        to="/"
                        sx={{
                            mr: 4,
                            fontWeight: 900,
                            textDecoration: 'none',
                            color: 'primary.main',
                            letterSpacing: -0.5
                        }}
                    >
                        AUTOTESTX
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
                        <Button component={RouterLink} to="/" sx={{ fontWeight: 'bold', color: 'inherit', textTransform: 'none' }}>Home</Button>
                        <Button component={RouterLink} to="/projects" sx={{ fontWeight: 'bold', color: 'inherit', textTransform: 'none' }}>Projects</Button>
                        <Button component={RouterLink} to="/dashboard" sx={{ fontWeight: 'bold', color: 'inherit', textTransform: 'none' }}>Dashboard</Button>
                        <Button component={RouterLink} to="/tests" sx={{ fontWeight: 'bold', color: 'inherit', textTransform: 'none' }}>Test Cases</Button>
                        <Button component={RouterLink} to="/history" sx={{ fontWeight: 'bold', color: 'inherit', textTransform: 'none' }}>History</Button>
                        <Button component={RouterLink} to="/settings" sx={{ fontWeight: 'bold', color: 'inherit', textTransform: 'none' }}>Settings</Button>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 0.5, bgcolor: 'rgba(76, 175, 80, 0.1)', borderRadius: 2 }}>
                            <Box sx={{ width: 8, height: 8, bgcolor: '#4caf50', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
                            <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>PIPELINE ACTIVE</Typography>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
            <Container sx={{ mt: 4 }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/tests" element={<TestCases />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/history" element={<RunHistory />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Container>
        </>
    );
}

export default App;
