const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  categories: [String], // optional if you're using categories
  status: {
    type: String,
    enum: ['Ongoing', 'Completed'],
    default: 'Ongoing'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
