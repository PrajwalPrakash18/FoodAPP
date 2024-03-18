import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
 productid: { type: String, required: true, unique: true },
 name: {type: String, required: true},
 price:{type: Number, required: true },
 imageurl: {type: String, required: true },
 description:{type: String, required: true },
 category:{type: String, required: true }
},
{
  timestamps:true
});


const Product = mongoose.model('Product', productSchema);

export { Product };
