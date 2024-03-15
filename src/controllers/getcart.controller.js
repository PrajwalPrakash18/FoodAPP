import AddToCart from '../models/Models/AddtoCart.models.js';
import { Product } from '../models/Models/Products.Models.js';
import { ApiError } from '../utils/ApiError.js';
import mongoose from 'mongoose';

const getCartItems = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user's cart
    const cart = await AddToCart.findOne({ userId }).populate('products.productId');

    // If cart not found, return an error
    if (!cart) {
      throw new ApiError(404, 'Cart not found');
    }

    res.status(200).json({ success: true, items: cart.products });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};


export { getCartItems };
