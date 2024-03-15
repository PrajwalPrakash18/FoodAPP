import AddToCart from '../models/Models/AddtoCart.models.js';
import { ApiError } from '../utils/ApiError.js';

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Validate input data
    if (!userId || !productId || !quantity || quantity < 1) {
      throw new ApiError(400, 'Invalid input data');
    }

    // Add the product to the user's cart
    let cart = await AddToCart.findOne({ userId });
    if (!cart) {
      cart = new AddToCart({ userId, products: [{ productId, quantity }] });
    } else {
      // Check if the product is already in the cart
      const existingProductIndex = cart.products.findIndex(item => item.productId === productId);
      if (existingProductIndex !== -1) {
        // If the product exists, update the quantity
        cart.products[existingProductIndex].quantity += quantity;
      } else {
        // If the product does not exist, add it to the cart
        cart.products.push({ productId, quantity });
      }
    }

    // Save the cart to the database
    await cart.save();

    res.status(200).json({ success: true, message: 'Product added to cart successfully' });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};


export { addToCart };
