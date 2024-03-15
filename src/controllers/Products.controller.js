import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { uploadonCloudinary } from '../utils/cloudinary.js';
import { Product } from '../models/Models/Products.Models.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { BAD_REQUEST } from '../constants/httpstatus.js';

const storeProducts = asyncHandler(async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || !Array.isArray(products)) {
      throw new ApiError(BAD_REQUEST, 'Invalid product data');
    }

    const savedProducts = await Promise.all(products.map(async (product) => {
      const { name, price, imageurl, description, category } = product;

      if (!name || !price || isNaN(price) || !imageurl || !description || !category) {
        throw new ApiError(BAD_REQUEST, 'Invalid product data');
      }

      // Upload the image to Cloudinary
      const cloudinaryInfo = await uploadonCloudinary(imageurl);

      if (!cloudinaryInfo || !cloudinaryInfo.secure_url) {
        throw new ApiError(BAD_REQUEST, 'Error uploading image to Cloudinary');
      }

      const newProduct = await Product.create({
        name,
        price,
        imageurl: cloudinaryInfo.secure_url,
        description,
        category
      });

      return newProduct;
    }));

    const response = new ApiResponse(201, savedProducts, 'Products stored successfully');
    res.json(response);
  } catch (error) {
    console.error('Error storing products:', error);
    res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
});

export { storeProducts };
