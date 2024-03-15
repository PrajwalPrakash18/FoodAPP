import { ApiError } from "../utils/ApiError.js";
import AddToCart from "../models/Models/AddtoCart.models.js"
import {Order} from "../models/Models/Ordersummary.Models.js"

const addToCart = async (req, res) => {
  try {
    const { userId, products } = req.body;

    if (!userId || !products || typeof products !== 'object') {
      throw new ApiError(400, 'Invalid cart data');
    }

    const cart = await Order.findOne({ userId });
    if (!cart) {
      // Create a new cart if not found
      const newCart = new Order({ userId, products });
      await newCart.save();
    } else {
      // Update existing cart
      await Promise.all(Object.keys(products).map(async (productId) => {
        const quantity = products[productId];
        const existingProduct = cart.products.find(item => item.productId.equals(productId));
        if (existingProduct) {
          existingProduct.quantity += quantity;
        } else {
          cart.products.push({ productId, quantity });
        }
      }));
      await cart.save();
    }
    res.status(200).json({ success: true, message: 'Products added to cart successfully' });
  } catch (error) {
    console.error('Error adding products to cart:', error);
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

export { addToCart };
