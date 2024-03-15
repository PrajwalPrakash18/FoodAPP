import mongoose from 'mongoose';
import { Product } from './Products.Models.js';
import { Address } from './Address.Models.js';

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  cost: {
    type: Number,
    required: Product.price,
  },
});

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  products: [productSchema],
  status: {
    type: String,
    enum: ['WAITING TO ACCEPT', 'PROCESSING', 'OUT FOR DELIVERY', 'DELIVERED'],
    default: 'WAITING TO ACCEPT',
  },
  taxAmount: {
    type: Number,
    default: 0,
  },
  address : {type : Address.schema} ,
}, { timestamps: true });

export const Order = mongoose.model('Order', orderSchema);
