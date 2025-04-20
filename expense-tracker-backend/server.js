const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());  // Parse JSON bodies

// Routes
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

app.use('/api/auth', authRoutes);          // Handles: /register, /login
app.use('/api/expenses', expenseRoutes);  // Handles: GET, POST, PUT, DELETE for expenses

// Root endpoint to confirm server is alive
app.get('/', (req, res) => {
  res.send('🚀 Expense Tracker API is running!');
});

// Global 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
