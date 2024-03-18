import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { Auth } from '../models/Models/Auth.Models.js'; 
import { NOT_FOUND, UNAUTHORIZED, INTERNAL_SERVER_ERROR } from "../constants/httpstatus.js"

const login = async (req, res) => {
  const { loginIdentifier, password } = req.body;

  try {
    if (!loginIdentifier || !password) {
      throw new ApiError(BAD_REQUEST, 'Please provide both loginIdentifier and password');
    }

    let user;

    // Check if loginIdentifier is an email address
    user = await Auth.findOne({ email: loginIdentifier });

    // If user is not found by email, check if it's a phone number
    if (!user) {
      user = await Auth.findOne({ phone: loginIdentifier });
    }

    if (!user) {
      throw new ApiError(NOT_FOUND, 'User not found');
    }

    // Verify password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new ApiError(UNAUTHORIZED, 'Incorrect password');
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '30d',
    });

    res.json(new ApiResponse(200, { token, user }, 'Login successful'));
  } catch (error) {
    console.error('Error during login:', error);
    res
      .status(error.statusCode || INTERNAL_SERVER_ERROR)
      .json(new ApiResponse(error.statusCode || INTERNAL_SERVER_ERROR, null, error.message));
  }
};

export { login };
