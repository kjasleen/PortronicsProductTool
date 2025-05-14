const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phase: { type: mongoose.Schema.Types.ObjectId, ref: 'Phase', required: true },
  estimatedCompletionDate: { type: Date },
  documentUrl: { type: String },
  status: {
    type: String,
    enum: ['Ongoing', 'Completed', 'Approval Pending', 'Approved'],
    default: 'Ongoing'
  },
 // needsApproval: { type: Boolean, default: false },
  approvalRequested: { type: Boolean, default: false },
  approved: { type: Boolean, default: false },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Task', taskSchema);
