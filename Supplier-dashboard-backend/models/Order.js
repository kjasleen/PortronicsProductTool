import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  productName: String,
  totalOrdered: Number,
  productionStarted: Number,
  shipped: Number,
  productionStartedDate: Date,
  productionCompletionDate: Date, // renamed from estimatedProductionCompletionDate
  shippingDate: Date,

  shippingMode: {
    type: String,
    enum: ['Air', 'Sea'],
    default: 'Sea'
  },
  landingPort: {
    type: String,
    enum: ['Delhi', 'Mumbai', 'Chennai'],
    default: 'Delhi'
  },
  estimatedLandingDate: Date,

  withPacking: { type: Boolean, default: true },
  masterCartonSize: { type: Number },

  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
