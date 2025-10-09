import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// MIDDLEWARE TO PROTECT ROUTES

export const protectRoute = async (req, res, next) => {
  try {
    const token =
      req.headers.token || req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.userId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format',
      });
    }
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log('🚀 ~ protectRoute ~ error.message:', error.message);
    res.json({ success: false, message: error.message });
  }
};
