// user.model.js

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // Other user details
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auth', // Reference to the 'Auth' model or whatever your user authentication model is called
    required: true,
  },
});

export const User = mongoose.model('User', userSchema);
