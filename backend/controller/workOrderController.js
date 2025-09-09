const WorkOrder = require('../models/WorkOrder');

exports.list = async (req, res) => {
  try {
    const { status, technician, from, to } = req.query;
    const query = {};
    if (status) query.status = status;
    if (technician) query.assignedTechnician = technician;
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }

    const items = await WorkOrder.find(query)
      .populate('equipment')
      .populate('assignedTechnician', 'name email role')
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch work orders', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, equipment, priority, status, assignedTechnician, description, dueDate } = req.body;
    if (!title || !equipment) return res.status(400).json({ message: 'Missing fields' });
    const item = await WorkOrder.create({ title, equipment, priority, status, assignedTechnician, description, dueDate });
    const populated = await WorkOrder.findById(item._id)
      .populate('equipment')
      .populate('assignedTechnician', 'name email role');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create work order', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await WorkOrder.findByIdAndUpdate(id, req.body, { new: true })
      .populate('equipment')
      .populate('assignedTechnician', 'name email role');
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update work order', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await WorkOrder.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete work order', error: err.message });
  }
};


