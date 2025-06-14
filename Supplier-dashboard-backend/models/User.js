// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  passwordHash: String,
  role: { type: String, enum: ['supplier', 'company'], required: true },
  supplierName: String, // Only for suppliers
});

export default mongoose.model('User', userSchema);
