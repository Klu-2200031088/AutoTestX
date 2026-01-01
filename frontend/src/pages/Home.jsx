import React from 'react';
import { Box, Typography } from '@mui/material';

function Home() {
    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
                Welcome to AutoTestX
            </Typography>
            <Typography>
                Use the navigation to manage test cases.
            </Typography>
        </Box>
    );
}

export default Home;
