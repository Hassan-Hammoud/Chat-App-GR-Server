import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.js';
import User from '../models/User.js';

//  SIGNUP A NEW User

export const signup = async (req, res) => {
  const { fullName, email, password, bio } = req.body;

  try {
    if (!fullName || !email || !password || !bio) {
      return res.json({ success: false, message: 'Missing Details' });
    }

    //  CHECK IF USER EXISTS
    const user = await User.findOne({ email });
    if (user) {
      return res.json({ success: false, message: 'Account already exists' });
    }

    //  Hashed password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //    IF USER DOES NOT EXIST CREATE A NEW USER

    const newUser = await User.create({
      fullName,
      email,
      password,
      bio,
    });

    // GENERATE TOKEN
    const token = generateToken(newUser._id);
    // SAVE USER DATA
    res.json({
      success: true,
      userData: newUser,
      token,
      message: 'Account created successfully',
    });
  } catch (error) {
    console.log('🚀 ~ signup ~ error.message:', error.message);
    res.json({ success: false, message: error.message });
  }
};

// CONTROLLER TO LOGIN A USER

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userData = await User.findOne({ email });
    const isPasswordCorrect = await bcrypt.compare(password, userData.password);

    if (!isPasswordCorrect) {
      return res.json({ success: false, message: 'Invalid credentials' });
    }
    // GENERATE TOKEN
    const token = generateToken(userData._id);
    // SAVE USER DATA
    res.json({
      success: true,
      userData,
      token,
      message: 'Login successful',
    });
  } catch (error) {
    console.log('🚀 ~ signup ~ error.message:', error.message);
    res.json({ success: false, message: error.message });
  }
};

// CONTROLLER TO CHECK IF USER IS AUTHENTICATED

export const checkAuth = (req, res) => {
  res.json({ success: true, user: req.user });
};
