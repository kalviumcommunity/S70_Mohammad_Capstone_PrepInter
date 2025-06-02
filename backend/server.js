const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
// const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/users', require('./routes/userRoutes'));

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to PrepInter API' });
});

// app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});