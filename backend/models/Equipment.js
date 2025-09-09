const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, enum: ['operational', 'maintenance_due', 'down'], default: 'operational' },
  lastMaintenanceDate: { type: Date },
  nextMaintenanceDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Equipment', equipmentSchema);


