import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },

  productSnapshot: {
    productName: String,
    sku: String,
    categoryName: String,
    superCategoryName: String,
  },

  totalOrdered: Number,
  productionStarted: Number,
  shipped: Number,
  productionStartedDate: Date,
  productionCompletionDate: Date,
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
  masterCartonSize: Number,

  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
