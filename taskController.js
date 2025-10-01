import { validationResult } from 'express-validator';
import Task from '../models/Task.js';

export async function listTasks(req, res) {
  const { q, status } = req.query;
  const filter = { user: req.user.id };
  if (status) filter.status = status;
  if (q) filter.title = { $regex: q, $options: 'i' };
  const tasks = await Task.find(filter).sort({ createdAt: -1 });
  res.json({ tasks });
}

export async function createTask(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { title, description, status } = req.body;
  const task = await Task.create({ user: req.user.id, title, description, status });
  res.status(201).json({ task });
}

export async function getTask(req, res) {
  const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json({ task });
}

export async function updateTask(req, res) {
  const updates = {};
  ['title', 'description', 'status'].forEach((k) => {
    if (req.body[k] !== undefined) updates[k] = req.body[k];
  });
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { $set: updates },
    { new: true }
  );
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json({ task });
}

export async function deleteTask(req, res) {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json({ success: true });
}
