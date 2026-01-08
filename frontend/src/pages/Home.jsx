import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Container, Paper, Stack, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
    Autorenew,
    Storage,
    Insights,
    Speed,
    PlayArrow,
    ChevronLeft,
    ChevronRight,
    Assessment,
    CloudQueue
} from '@mui/icons-material';

// Import images (Vite handle)
import aiPriorityImg from '../assets/ai_priority.png';
import dockerRunnerImg from '../assets/docker_runner.png';
import analyticsImg from '../assets/analytics.png';

const DEMO_SLIDES = [
    {
        title: "Intelligent Test Prioritization",
        description: "AutoTestX uses AI to analyze risk scores and history to execute the most critical tests first, saving up to 60% execution time.",
        image: aiPriorityImg
    },
    {
        title: "Isolated Containerized Runs",
        description: "Execute tests in clean, isolated Docker containers to ensure consistent results and eliminate 'flaky' test failures.",
        image: dockerRunnerImg
    },
    {
        title: "Deep Analytical Insights",
        description: "Visualize trends, success rates, and performance bottlenecks with powerful built-in charting and PDF reports.",
        image: analyticsImg
    }
];

function Home() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % DEMO_SLIDES.length);
        }, 8000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % DEMO_SLIDES.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + DEMO_SLIDES.length) % DEMO_SLIDES.length);

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', overflowX: 'hidden', mt: -4 }}>
            {/* Hero Section */}
            <Box
                sx={{
                    pt: 15, pb: 20,
                    textAlign: 'center',
                    background: 'radial-gradient(circle at 50% 50%, rgba(33, 150, 243, 0.15) 0%, transparent 70%)',
                    position: 'relative'
                }}
            >
                <Container maxWidth="md">
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: { xs: '3.5rem', md: '5.5rem' },
                            fontWeight: 900,
                            mb: 2,
                            background: 'linear-gradient(45deg, #2196f3 30%, #f50057 90%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            lineHeight: 1.1
                        }}
                    >
                        Master Your<br />Testing Pipeline
                    </Typography>
                    <Typography variant="h4" color="textSecondary" sx={{ mb: 5, fontWeight: 300, fontSize: { xs: '1.5rem', md: '2.1rem' } }}>
                        AI-Powered Orchestration for Modern QA
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 6, fontSize: '1.25rem', color: 'text.secondary', maxWidth: '750px', mx: 'auto', lineHeight: 1.6 }}>
                        Supercharge your deployment speed with risk-aware prioritization,
                        isolated Dockerized execution, and enterprise-grade analytics.
                        Testing has never been this smart.
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
                        <Button
                            component={RouterLink}
                            to="/dashboard"
                            variant="contained"
                            size="large"
                            startIcon={<PlayArrow />}
                            sx={{
                                px: 6, py: 2,
                                borderRadius: 3,
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                boxShadow: '0 8px 32px rgba(33, 150, 243, 0.4)',
                                textTransform: 'none'
                            }}
                        >
                            Start Execution
                        </Button>
                        <Button
                            component={RouterLink}
                            to="/tests"
                            variant="outlined"
                            size="large"
                            sx={{
                                px: 6, py: 2,
                                borderRadius: 3,
                                fontSize: '1.1rem',
                                textTransform: 'none',
                                borderWidth: 2,
                                '&:hover': { borderWidth: 2 }
                            }}
                        >
                            Explore Test Suite
                        </Button>
                    </Stack>
                </Container>
            </Box>

            {/* Features Section */}
            <Container maxWidth="lg" sx={{ mb: 20 }}>
                <Box textAlign="center" sx={{ mb: 10 }}>
                    <Typography variant="overline" color="primary" sx={{ fontWeight: 800, letterSpacing: 2 }}>CORE ENGINE</Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1 }}>What AutoTestX Does</Typography>
                </Box>
                <Grid container spacing={4}>
                    {[
                        { icon: <Autorenew color="primary" sx={{ fontSize: 40 }} />, title: "AI Prioritization", desc: "Our proprietary algorithm predicts failure probability and prioritizes high-impact tests using historical data." },
                        { icon: <CloudQueue color="secondary" sx={{ fontSize: 40 }} />, title: "Isolated Runners", desc: "No more dependency hell. Every test run is spun up in an isolated Docker container for total environment purity." },
                        { icon: <Assessment sx={{ color: '#4caf50', fontSize: 40 }} />, title: "Real-time Metrics", desc: "Live dashboards and historical trends give you unparalleled visibility into your suite's stability and performance." },
                        { icon: <Speed sx={{ color: '#ff9800', fontSize: 40 }} />, title: "CI/CD Integration", desc: "Seamlessly hooks into your existing pipeline to provide intelligent test feedback in minutes, not hours." }
                    ].map((f, i) => (
                        <Grid item xs={12} sm={6} md={3} key={i}>
                            <Paper
                                sx={{
                                    p: 5,
                                    height: '100%',
                                    borderRadius: 5,
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    border: '1px solid transparent',
                                    '&:hover': {
                                        transform: 'translateY(-12px)',
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                                        borderColor: 'rgba(33, 150, 243, 0.2)',
                                        bgcolor: 'rgba(33, 150, 243, 0.02)'
                                    }
                                }}
                                elevation={0}
                            >
                                <Box sx={{ mb: 3 }}>{f.icon}</Box>
                                <Typography variant="h5" sx={{ mb: 2, fontWeight: 800 }}>{f.title}</Typography>
                                <Typography color="textSecondary" sx={{ lineHeight: 1.6 }}>{f.desc}</Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Carousel Section */}
            <Box sx={{ bgcolor: '#0a1929', py: 20, color: 'white' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={10} alignItems="center">
                        <Grid item xs={12} md={5}>
                            <Stack spacing={4}>
                                <Box>
                                    <Typography variant="overline" sx={{ color: 'primary.light', fontWeight: 'bold', fontSize: '1.1rem', letterSpacing: 1.5 }}>
                                        PLATFORM DEMO
                                    </Typography>
                                    <Typography variant="h2" sx={{ mb: 3, mt: 2, fontWeight: 900, lineHeight: 1.2 }}>
                                        {DEMO_SLIDES[currentSlide].title}
                                    </Typography>
                                    <Typography variant="h6" sx={{ color: 'grey.400', fontWeight: 300, lineHeight: 1.7 }}>
                                        {DEMO_SLIDES[currentSlide].description}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <IconButton
                                        onClick={prevSlide}
                                        sx={{
                                            color: 'white',
                                            bgcolor: 'rgba(255,255,255,0.05)',
                                            border: '1px solid',
                                            borderColor: 'rgba(255,255,255,0.1)',
                                            '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                                        }}
                                    >
                                        <ChevronLeft />
                                    </IconButton>
                                    <IconButton
                                        onClick={nextSlide}
                                        sx={{
                                            color: 'white',
                                            bgcolor: 'rgba(255,255,255,0.05)',
                                            border: '1px solid',
                                            borderColor: 'rgba(255,255,255,0.1)',
                                            '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                                        }}
                                    >
                                        <ChevronRight />
                                    </IconButton>
                                </Box>

                                <Stack direction="row" spacing={1}>
                                    {DEMO_SLIDES.map((_, i) => (
                                        <Box
                                            key={i}
                                            sx={{
                                                width: i === currentSlide ? 40 : 12,
                                                height: 4,
                                                bgcolor: i === currentSlide ? 'primary.main' : 'rgba(255,255,255,0.2)',
                                                borderRadius: 2,
                                                transition: '0.4s'
                                            }}
                                        />
                                    ))}
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={7}>
                            <Paper
                                sx={{
                                    borderRadius: 6,
                                    overflow: 'hidden',
                                    boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
                                    lineHeight: 0,
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    bgcolor: '#001e3c'
                                }}
                            >
                                <Box
                                    component="img"
                                    src={DEMO_SLIDES[currentSlide].image}
                                    key={currentSlide}
                                    sx={{
                                        width: '100%',
                                        height: 'auto',
                                        animation: 'fadeIn 0.8s ease-out',
                                        '@keyframes fadeIn': {
                                            from: { opacity: 0, transform: 'scale(1.05)' },
                                            to: { opacity: 1, transform: 'scale(1)' }
                                        }
                                    }}
                                />
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* CTA Footer */}
            <Box sx={{ py: 20, textAlign: 'center', background: 'linear-gradient(to bottom, #f8f9fa 0%, white 100%)' }}>
                <Container maxWidth="md">
                    <Paper
                        sx={{
                            p: { xs: 6, md: 10 },
                            borderRadius: 10,
                            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                            color: 'white',
                            boxShadow: '0 30px 60px rgba(25, 118, 210, 0.3)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Decorative circles */}
                        <Box sx={{ position: 'absolute', top: -100, right: -100, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                        <Box sx={{ position: 'absolute', bottom: -50, left: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

                        <Typography variant="h2" sx={{ mb: 4, fontWeight: 900, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                            Scale Your QA Today
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 6, opacity: 0.9, maxWidth: '600px', mx: 'auto', fontWeight: 300 }}>
                            Join forward-thinking engineering teams using AutoTestX to eliminate bottlenecks and ship with confidence.
                        </Typography>
                        <Button
                            component={RouterLink}
                            to="/dashboard"
                            variant="contained"
                            size="large"
                            sx={{
                                px: 10, py: 2.5,
                                borderRadius: 4,
                                fontSize: '1.3rem',
                                fontWeight: 900,
                                bgcolor: 'white',
                                color: 'primary.main',
                                textTransform: 'none',
                                '&:hover': { bgcolor: '#f0f0f0', transform: 'scale(1.05)' },
                                transition: '0.3s'
                            }}
                        >
                            Get Started Free
                        </Button>
                    </Paper>
                </Container>
            </Box>
        </Box>
    );
}

export default Home;
