import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true },
  productName: { type: String, required: true },
  category: { type: String, required: true },
  superCategory: { type: String, required: true },
});

export default mongoose.model('Product', productSchema);
