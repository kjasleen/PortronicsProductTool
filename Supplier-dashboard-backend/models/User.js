// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true, required: true },
  passwordHash: String,
  role: { type: String, enum: ['admin','supplier', 'company'], required: true },
  supplierName: String,
  resetToken: String,
  resetTokenExpiry: Date,
});


export default mongoose.model('User', userSchema);
