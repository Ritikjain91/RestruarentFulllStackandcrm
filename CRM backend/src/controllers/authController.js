const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

/**
 * @desc    Register a new employee/counselor
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An employee with this email already exists'
      });
    }

    // Create new employee
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      role: role || 'counselor'
    });

    // Generate JWT token
    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role
    });

    res.status(201).json({
      success: true,
      message: 'Employee registered successfully',
      token,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Employee login
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role
    });

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get currently logged in employee profile
 * @route   GET /api/auth/me
 * @access  Private (Employee/Counselor)
 */
const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe
};

