import jwt from 'jsonwebtoken';
import { UNAUTHORIZED } from  "../constants/httpstatus.js"
import { ApiError } from '../utils/ApiError.js';

const authenticate = async (req, res, next) => {
  const token = req.headers.access_token;
  if (!token) {
    throw new ApiError(UNAUTHORIZED, 'Unauthorized - Token not provided');
  }

  try {
    const decoded = await verify(token);
    req.user = decoded;
    next();
  } catch (error) {
    throw new ApiError(UNAUTHORIZED, 'Unauthorized - Invalid token', [], error.stack);
  }
};

export  default authenticate;
