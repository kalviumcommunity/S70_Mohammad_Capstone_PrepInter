const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { errorHandler, notFound, validationErrorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/interviews', require('./routes/interviewRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/interview', require('./routes/interviewSessionRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// Welcome route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to PrepInter API' });
});

// Error handler middleware
app.use(errorHandler);
app.use(validationErrorHandler);
app.use(notFound);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error(`Error: ${err.message}`);
  // Close server & exit process
  // server.close(() => process.exit(1));
});