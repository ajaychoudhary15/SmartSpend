const dotenv = require('dotenv');
// Load environment variables before importing app
dotenv.config();

const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and then start server
connectDB()
  .then(() => {
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`[SmartSpend Server] Running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });

    process.on('unhandledRejection', (err) => {
      console.error(`Unhandled Rejection Error: ${err.message}`);
      // Gracefully close server & exit process
      server.close(() => process.exit(1));
    });
  })
  .catch((err) => {
    console.error(`Failed to connect to database. Server not started. Error: ${err.message}`);
    process.exit(1);
  });
