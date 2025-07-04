import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  superCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'SuperCategory', required: true },
}, { timestamps: true });

categorySchema.index({ name: 1, superCategoryId: 1 }, { unique: true });

export default mongoose.model('Category', categorySchema);
