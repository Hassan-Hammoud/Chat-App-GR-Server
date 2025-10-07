import { jwt } from 'jsonwebtoken';
import User from '../models/User.js';

// MIDDLEWARE TO PROTECT ROUTES

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.header.token;
    const decoded = jwt.verify(token.process.env.JWT_SECRET);
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
