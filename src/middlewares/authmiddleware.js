import jwt from 'jsonwebtoken';
import { UNAUTHORIZED } from "../constants/httpstatus.js";
import { ApiError } from '../utils/ApiError.js';

const authenticate = async (req, res, next) => {
  const token = req.headers.access_token;
  if (!token) {
    throw new ApiError(UNAUTHORIZED, 'Unauthorized - Token not provided');
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = decoded.userId; // Store only the user ID in the request object
    next();
  } catch (error) {
    throw new ApiError(UNAUTHORIZED, 'Unauthorized - Invalid token', [], error.stack);
  }
};

export default authenticate;
