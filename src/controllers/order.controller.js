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

    // Create an order item
    const orderItem = {
      food: product,
      quantity: quantity
    };

    // Check if the user already has an active cart
    let order = await OrderSchema.findOne({ user: userId, status: 'NEW' });

    if (!order) {
      // If no active cart found, create a new one
      order = new OrderSchema({
        user: userId,
        items: [orderItem],
        totalPrice: orderItem.price,
        status: 'NEW'
      });
    } else {
      // If an active cart found, update the cart with the new item
      order.items.push(orderItem);
      order.totalPrice += orderItem.price;
    }

    // Save the order
    await order.save();

    res.json(new ApiResponse(200, order, 'Product added to cart successfully'));
  } catch (error) {
    console.error('Error adding product to cart:', error);
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

export { addToCart, placeOrder };
