import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  productName: String,
  totalOrdered: Number,
  productionStarted: Number,
  shipped: Number,
  productionStartedDate: Date,
  estimatedProductionCompletionDate: Date,
  shippingDate: Date,
  withPacking: { type: Boolean, default: true },
  masterCartonSize: { type: Number, min: 1 },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
