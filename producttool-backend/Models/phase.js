const mongoose = require('mongoose');

const phaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Phase name is required'],
    minlength: [3, 'Phase name must be at least 3 characters']
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
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

module.exports = mongoose.model('Phase', phaseSchema);
