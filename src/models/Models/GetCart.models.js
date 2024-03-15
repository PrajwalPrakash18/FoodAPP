import mongoose from 'mongoose';

const getCartSchema = new mongoose.Schema({
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

const GetCart = mongoose.model('GetCart', getCartSchema);

export default GetCart;
