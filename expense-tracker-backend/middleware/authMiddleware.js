const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust path as needed

const protect = async (req, res, next) => {
  let token;

  // Check if the authorization header exists and contains the Bearer token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token from the Authorization header
      token = req.headers.authorization.split(' ')[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user information to the request object (excluding password)
      req.user = await User.findById(decoded.id).select('-password');

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If no token is found
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
