import mongoose from 'mongoose';
import { Product } from './Products.Models.js';
import { Address } from './Address.Models.js';

const productSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  totalAmount: {
    type: Number,
    required: true,
  },
  address: {
    type: Address.schema,
    required: true,
  },
}, { timestamps: true });

export const Order = mongoose.model('Order', orderSchema);
