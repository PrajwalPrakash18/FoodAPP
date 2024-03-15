import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { OrderSchema } from '../models/Order.Models.js'; // Assuming the correct path to the Order schema
import { asyncHandler } from '../utils/asyncHandler.js';
import { Product } from '../models/Products.Models.js'; // Assuming the correct path to the Product model
import { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } from '../constants/httpstatus.js'; // Importing necessary constants

const addToCart = asyncHandler(async (req, res) => {
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
});

const viewCart = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.body;

    // Find the user's active cart
    const cart = await OrderSchema.findOne({ user: userId, status: 'NEW' }).populate('items.food');

    if (!cart) {
      throw new ApiError(NOT_FOUND, 'Cart not found');
    }

    res.json(new ApiResponse(200, cart, 'Cart retrieved successfully'));
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(error.statusCode || INTERNAL_SERVER_ERROR).json(new ApiResponse(error.statusCode || INTERNAL_SERVER_ERROR, null, error.message));
  }
});

const updateCart = asyncHandler(async (req, res) => {
  try {
    const { userId, itemId, quantity } = req.body;

    // Validate input data
    if (!userId || !itemId || !quantity || quantity < 1) {
      throw new ApiError(BAD_REQUEST, 'Invalid input data');
    }

    // Find the user's active cart
    const cart = await OrderSchema.findOne({ user: userId, status: 'NEW' });

    if (!cart) {
      throw new ApiError(NOT_FOUND, 'Cart not found');
    }

    // Find the item in the cart
    const itemToUpdate = cart.items.find(item => item._id == itemId);

    if (!itemToUpdate) {
      throw new ApiError(NOT_FOUND, 'Item not found in cart');
    }

    // Update the item quantity and total price
    const previousQuantity = itemToUpdate.quantity;
    itemToUpdate.quantity = quantity;
    cart.totalPrice += (quantity - previousQuantity) * itemToUpdate.food.price;

    // Save the updated cart
    await cart.save();

    res.json(new ApiResponse(200, cart, 'Cart updated successfully'));
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(error.statusCode || INTERNAL_SERVER_ERROR).json(new ApiResponse(error.statusCode || INTERNAL_SERVER_ERROR, null, error.message));
  }
});

const removeItemFromCart = asyncHandler(async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    // Find the user's active cart
    const cart = await OrderSchema.findOne({ user: userId, status: 'NEW' });

    if (!cart) {
      throw new ApiError(NOT_FOUND, 'Cart not found');
    }

    // Find the index of the item in the cart
    const itemIndex = cart.items.findIndex(item => item._id == itemId);

    if (itemIndex === -1) {
      throw new ApiError(NOT_FOUND, 'Item not found in cart');
    }

    // Remove the item from the cart
    const removedItem = cart.items.splice(itemIndex, 1)[0];
    cart.totalPrice -= removedItem.price * removedItem.quantity;

    // Save the updated cart
    await cart.save();

    res.json(new ApiResponse(200, cart, 'Item removed from cart successfully'));
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(error.statusCode || INTERNAL_SERVER_ERROR).json(new ApiResponse(error.statusCode || INTERNAL_SERVER_ERROR, null, error.message));
  }
});

export { addToCart, viewCart, updateCart, removeItemFromCart };
