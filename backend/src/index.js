require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
const testRoutes = require('./routes/tests');
const authRoutes = require('./routes/auth');
const executeRoutes = require('./routes/execute');
const aiRoutes = require('./routes/ai');
app.use('/api/tests', testRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/execute', executeRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => res.send('AutoTestX backend running'));

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
