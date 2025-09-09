const mongoose = require('mongoose');

const workOrderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  status: { type: String, enum: ['open', 'in_progress', 'completed', 'cancelled'], default: 'open' },
  assignedTechnician: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  description: { type: String },
  dueDate: { type: Date },
  createdDate: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('WorkOrder', workOrderSchema);


