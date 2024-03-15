import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { Login } from '../models/Models/Login.Models.js'; // Assuming the correct path to the Login model
import { BAD_REQUEST } from  '../constants/httpstatus.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Login
const login = asyncHandler(async (req, res) => {
  try {
    const { contact, pass } = req.body;
    const loginData = await Login.findOne({ $or: [{ mail: contact }, { pass: contact }] }).populate('userId');

    if (!loginData) {
      throw new ApiError(BAD_REQUEST, 'User not found');
    }

    const { userId, mail, pass: hashedPassword } = loginData;

    // Check password
    const isPasswordMatch = await bcrypt.compare(pass, hashedPassword);
    if (!isPasswordMatch) {
      throw new ApiError(BAD_REQUEST, 'Incorrect password');
    }

    // Generate JWT token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.json(new ApiResponse(200, { token, userId, mail }));
  } catch (error) {
    console.error('Error during login:', error);
    res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
});

export { login };
