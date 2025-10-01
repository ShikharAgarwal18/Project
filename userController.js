import { validationResult } from 'express-validator';
import User from '../models/User.js';

export async function getProfile(req, res) {
  const user = await User.findById(req.user.id).select('-password');
  res.json({ user });
}

export async function updateProfile(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const updates = {};
  ['name', 'email'].forEach((k) => {
    if (req.body[k]) updates[k] = req.body[k];
  });
  // handle password change
  if (req.body.password) updates.password = req.body.password;
  let user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  Object.assign(user, updates);
  await user.save();
  user = user.toObject();
  delete user.password;
  res.json({ user });
}
