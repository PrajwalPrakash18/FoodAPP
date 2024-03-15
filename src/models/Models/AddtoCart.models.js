import mongoose from 'mongoose';

const addToCartSchema = new mongoose.Schema({
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      products: [{
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1
        },
      }]
    });
    
    
    const AddToCart = mongoose.model('AddToCart', addToCartSchema);
    
    export default AddToCart;
    
    