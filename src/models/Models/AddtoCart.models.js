import mongoose from 'mongoose';

const addToCartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  products: {
    type: Map,
    of: Number, // Assuming the value represents quantity
    required: true
  }
});

const AddToCart = mongoose.model('AddToCart', addToCartSchema);

export default AddToCart;
