// order.controller.js

import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { OrderSchema } from '../models/Models/Order.Models.js';
import { Product } from '../models/Models/Products.Models.js';
import { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } from '../constants/httpstatus.js';

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Validate input data
    if (!userId || !productId || !quantity || quantity < 1) {
      throw new ApiError(BAD_REQUEST, 'Invalid input data');
    }

    // Fetch the product details
    const product = await Product.findById(productId);

    if (!product) {
      throw new ApiError(NOT_FOUND, 'Product not found');
    }

    // Check if the user already has an active cart
    let order = await OrderSchema.findOne({ user: userId, status: 'NEW' });

    if (!order) {
      // If no active cart found, create a new one
      order = new OrderSchema({
        user: userId,
        items: [],
        totalPrice: 0, // Initialize total price to 0
        status: 'NEW'
      });
    }

    // Check if the product already exists in the cart
    const existingItemIndex = order.items.findIndex(item => item.food.equals(productId));

    if (existingItemIndex !== -1) {
      // If product already exists in the cart, update the quantity
      order.items[existingItemIndex].quantity += quantity;
      order.items[existingItemIndex].price += product.price * quantity;
    } else {
      // If product does not exist in the cart, add it
      order.items.push({ food: productId, quantity, price: product.price * quantity });
    }

    // Update total price
    order.totalPrice += product.price * quantity;

    // Save the order
    await order.save();

    res.json(new ApiResponse(200, order, 'Product added to cart successfully'));
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(error.statusCode || INTERNAL_SERVER_ERROR).json(new ApiResponse(error.statusCode || INTERNAL_SERVER_ERROR, null, error.message));
  }
};

const removeCartItem = async (req, res) => {
  try {
    const { userId, itemId } = req.params;

    // Find the user's active cart
    const order = await OrderSchema.findOne({ user: userId, status: 'NEW' });

    if (!order) {
      throw new ApiError(NOT_FOUND, 'Cart not found');
    }

    // Find the index of the item to be removed
    const itemIndex = order.items.findIndex(item => item._id.equals(itemId));

    if (itemIndex === -1) {
      throw new ApiError(NOT_FOUND, 'Item not found in cart');
    }

    // Remove the item from the cart
    const removedItem = order.items.splice(itemIndex, 1)[0];
    order.totalPrice -= removedItem.price;

    // Save the updated cart
    await order.save();

    res.json(new ApiResponse(200, order, 'Item removed from cart successfully'));
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(error.statusCode || INTERNAL_SERVER_ERROR).json(new ApiResponse(error.statusCode || INTERNAL_SERVER_ERROR, null, error.message));
  }
};


const placeOrder = async (req, res) => {
  try {
    const { userId, address } = req.body;

    // Find the user's active cart
    const cart = await OrderSchema.findOne({ user: userId, status: 'NEW' });

    if (!cart || cart.items.length === 0) {
      throw new ApiError(BAD_REQUEST, 'No items in the cart');
    }

    // Create a new order
    const order = new OrderSchema({
      user: userId,
      items: cart.items,
      totalPrice: cart.totalPrice,
      address: address,
      status: 'PLACED' // Update status to PLACED for placed orders
    });

    // Save the order
    await order.save();

    // Clear the user's cart
    await cart.remove();

    res.json(new ApiResponse(201, order, 'Order placed successfully'));
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(error.statusCode || INTERNAL_SERVER_ERROR).json(new ApiResponse(error.statusCode || INTERNAL_SERVER_ERROR, null, error.message));
  }
};

export { addToCart, removeCartItem, placeOrder };
