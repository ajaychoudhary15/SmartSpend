const mongoose = require('mongoose');
const dns = require('dns');

// Configure public DNS servers (Google & Cloudflare) to ensure reliable
// MongoDB Atlas SRV (_mongodb._tcp) record resolution on Windows and ISP routers
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (dnsErr) {
  console.warn('[Database] Note: Could not set custom DNS resolvers:', dnsErr.message);
}

const connectDB = async () => {
  let primaryUri = (process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smartspend').trim();
  const localUri = 'mongodb://127.0.0.1:27017/smartspend';

  // Sanitize common typo: double slash in hostname/path (e.g. cluster.mongodb.net//smartspend)
  if (primaryUri.includes('.mongodb.net//')) {
    primaryUri = primaryUri.replace('.mongodb.net//', '.mongodb.net/');
  }

  // Attempt 1: Connect to configured primary database (Atlas or custom URI)
  try {
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host} / ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[Database Warning] Primary connection attempt failed: ${error.message}`);

    // If primary was Atlas or external, but failed (e.g., auth failure or offline), try local MongoDB
    if (primaryUri !== localUri) {
      console.log('[Database] Attempting local MongoDB connection as a fallback...');
      try {
        const localConn = await mongoose.connect(localUri, {
          serverSelectionTimeoutMS: 2000,
        });
        console.log(`[Database Fallback] Connected to local MongoDB: ${localConn.connection.host} / ${localConn.connection.name}`);
        console.log('[Database Notice] Application is serving data from local MongoDB (127.0.0.1:27017). Verify Atlas credentials in server/.env when ready to switch to cloud.');
        return localConn;
      } catch (localErr) {
        console.error(`[Database Error] Local MongoDB fallback also unreachable: ${localErr.message}`);
      }
    }

    // If both attempts failed, throw the original error
    throw error;
  }
};

module.exports = connectDB;
