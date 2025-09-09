const Equipment = require('../models/Equipment');

exports.list = async (req, res) => {
  try {
    const items = await Equipment.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch equipment', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, type, status, lastMaintenanceDate, nextMaintenanceDate } = req.body;
    if (!name || !type) return res.status(400).json({ message: 'Missing fields' });
    const item = await Equipment.create({ name, type, status, lastMaintenanceDate, nextMaintenanceDate });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create equipment', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Equipment.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update equipment', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Equipment.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete equipment', error: err.message });
  }
};


