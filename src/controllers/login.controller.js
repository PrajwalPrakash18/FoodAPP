// login.controller.js
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { Auth } from '../models/Models/Auth.Models.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await Auth.findOne({ email });

  if (!user || !(await user.isPasswordCorrect(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // If login is successful, generate a token using MongoDB's _id as userId
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

  return res.status(200).json(
    new ApiResponse(200, { token }, 'User Logged In Successfully')
  );
});

export { loginUser };
