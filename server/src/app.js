const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const budgetRoutes = require('./routes/budgetRoutes');

const app = express();

// Allowed Origins for Local Development and Production Deployments (e.g. Netlify)
const configuredOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((s) => s.trim().replace(/\/+$/, ''))
  : [];

const localOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (Postman, curl, server-to-server)
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.replace(/\/+$/, '');

      // Allow configured origins, local development, or any Netlify preview/production deploy
      if (
        localOrigins.includes(normalizedOrigin) ||
        configuredOrigins.includes(normalizedOrigin) ||
        normalizedOrigin.endsWith('.netlify.app') ||
        process.env.NODE_ENV !== 'production'
      ) {
        return callback(null, true);
      }

      callback(null, true);
    },
    credentials: true,
  })
);

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    app: 'SmartSpend API',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budget', budgetRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
