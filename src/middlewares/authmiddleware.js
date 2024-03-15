// authMiddleware.js
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';

const authMiddleware = (req, res, next) => {
  // Extract the token from the request headers, assuming it's present in the "Authorization" header
  const token = req.headers.authorization;

  if (!token) {
    return next(new ApiError(401, 'Unauthorized - Token not provided'));
  }

  // Verify the token and extract the user ID
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new ApiError(401, 'Unauthorized - Invalid token'));
    }

    // Attach the user ID to the request object for further use
    req.user = {
      id: decoded.userId,
    };

    next();
  });
};

export { authMiddleware };
