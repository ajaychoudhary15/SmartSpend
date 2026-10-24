
const jwt = require('jsonwebtoken');
const User = require('../models/User');

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: No authentication token provided',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized: User account not found or deleted',
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    console.error('JWT verification error:', error.message);

    return res.status(401).json({
      success: false,
      message:
        error.name === 'TokenExpiredError'
          ? 'Authentication token expired, please log in again'
          : 'Invalid authentication token',
    });
  }
};

module.exports = { protect };