const express = require('express');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const contractRoutes = require('./routes/contract');
const walletRoutes = require('./routes/wallet');

const app = express();
const PORT = process.env.PORT || 5000;

// Routes
app.use('/api/register_asset', contractRoutes);
app.use('/api/contract', contractRoutes);
app.use('/api/contract', contractRoutes);
app.use('/api/wallet', walletRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('DApp Backend API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});