import { ApiError } from '../utils/ApiError.js';
import GetCart from '../models/Models/GetCart.models.js';

const getCart = async (req, res) => {
      try {
        const { userId } = req.query;
        // Fetch user's cart from the database
        const cart = await Order.findOne({ userId });
        if (!cart) {
          throw new ApiError(404, 'Cart not found');
        }
        res.status(200).json({ success: true, data: cart });
      } catch (error) {
        console.error('Error getting cart:', error);
        res.status(error.statusCode || 500).json({ success: false, message: error.message });
      }
    };

export {getCart}
    