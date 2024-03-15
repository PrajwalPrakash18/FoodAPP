// address.controller.js

import { Address } from '../models/Models/Address.Models.js';
import { ApiError } from '../utils/ApiError.js';

const addAddress = async (req, res) => {
  try {
    const { userId, location, place, state, pincode } = req.body;

    // Check if required parameters are provided
    if (!userId || !location || !place || !state || !pincode) {
      throw new ApiError(400, 'Missing required parameters');
    }

    // Create or update the user's address
    let address = await Address.findOneAndUpdate(
      { userId },
      { userId, location, place, state, pincode },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, message: 'Address added successfully', data: address });
  } catch (error) {
    console.error('Error adding address:', error);
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

export { addAddress };
