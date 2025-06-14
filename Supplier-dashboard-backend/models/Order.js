// models/Order.js
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  productName: String,
  totalOrdered: Number,
  productionStarted: Number,
  productionCompleted: Number,
  shippingStarted: Number,
  shipped: Number,
  status: { type: String, default: 'Ordered' },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
