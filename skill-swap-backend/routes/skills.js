import express from 'express';
import Skill from '../models/Skill.js';
import User from '../models/User.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

// Create skill
router.post('/', authRequired, async (req, res) => {
  try {
    const { name, level, description, availability, category, location } = req.body;
    const skill = await Skill.create({ name, level, description, owner: req.userId, availability, category, location });
    await User.findByIdAndUpdate(req.userId, { $push: { skillsOffered: skill._id } });
    res.json(skill);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// List skills
router.get('/', async (req, res) => {
  try {
    const { name, level, category, location } = req.query;
    const q = {};
    if (name) q.name = new RegExp(name, 'i');
    if (level) q.level = level;
    if (category) q.category = new RegExp(category, 'i');
    if (location) q.location = new RegExp(location, 'i');
    const skills = await Skill.find(q).populate('owner', 'name rating skillsWanted');
    res.json(skills);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

export default router;
