const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Haramaya FindIt API.' });
});

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/demo', require('./routes/demo.routes'));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message: 'An unexpected server error occurred.',
    details: process.env.NODE_ENV === 'production' ? undefined : err.message,
  });
});

module.exports = app;
