import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { uploadonCloudinary } from '../utils/cloudinary.js';
import { Product } from '../models/Models/Products.Models.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const storeProducts = asyncHandler(async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || !Array.isArray(products)) {
      throw new ApiError(400, 'Invalid product data');
    }

    const savedProducts = await Promise.all(products.map(async (product) => {
      const { productid, name, image, description, category, price } = product;

      if (!productid || !name || !image || !description || !category || !price || isNaN(price)) {
        throw new ApiError(400, 'Invalid product data');
      }

      // Upload the image to Cloudinary
      const cloudinaryInfo = await uploadonCloudinary(image);

      if (!cloudinaryInfo || !cloudinaryInfo.secure_url) {
        throw new ApiError(400, 'Error uploading image to Cloudinary');
      }

      const newProduct = await Product.create({
        productid,
        name,
        image: cloudinaryInfo.secure_url,
        description,
        category,
        price
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
