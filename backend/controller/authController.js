const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const SECRET = 'supersecretkey';

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

    const allowedRoles = ['technician', 'supervisor', 'manager'];
    const normalizedRole = allowedRoles.includes(role) ? role : 'technician';

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already exists' });

    const password_hash = bcrypt.hashSync(password, 10);
    const created = await User.create({ name, email, password_hash, role: normalizedRole });
    const user = { id: created._id.toString(), name: created.name, email: created.email, role: created.role };
    const token = jwt.sign(user, SECRET, { expiresIn: '2h' });
    return res.json({ token, user });
  } catch (err) {
    return res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing credentials' });
    const userDoc = await User.findOne({ email });
    if (!userDoc) return res.status(401).json({ message: 'Invalid credentials' });
    const valid = bcrypt.compareSync(password, userDoc.password_hash);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    const user = { id: userDoc._id.toString(), name: userDoc.name, email: userDoc.email, role: userDoc.role };
    const token = jwt.sign(user, SECRET, { expiresIn: '2h' });
    return res.json({ token, user });
  } catch (err) {
    return res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

exports.me = (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  return res.json({ user: req.user });
};
