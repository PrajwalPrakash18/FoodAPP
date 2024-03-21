import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { Product } from '../models/Models/Products.Models.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { INTERNAL_SERVER_ERROR } from '../constants/httpstatus.js';

const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find();

    if (!products || products.length === 0) {
      throw new ApiError(INTERNAL_SERVER_ERROR, 'No products found');
    }
    
    const response = new ApiResponse(200, products, 'Products retrieved successfully');
    res.json(response);
  } catch (error) {
    console.error('Error retrieving products:', error);
    res.status(error.statusCode || INTERNAL_SERVER_ERROR).json(new ApiResponse(error.statusCode || INTERNAL_SERVER_ERROR, null, error.message));
  }
});

export { getAllProducts };
