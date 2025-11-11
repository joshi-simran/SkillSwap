import express from 'express';
import User from '../models/User.js';
import Skill from '../models/Skill.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

// Get my profile
router.get('/me', authRequired, async (req, res) => {
  try{
    const me = await User.findById(req.userId).populate('skillsOffered');
    res.json(me);
  }catch(e){ res.status(500).json({ error: e.message }); }
});

// Update my profile
router.put('/me', authRequired, async (req, res) => {
  try{
    const { name, bio, location, avatarUrl, skillsWanted } = req.body;
    const update = {};
    if (name !== undefined) update.name = name;
    if (bio !== undefined) update.bio = bio;
    if (location !== undefined) update.location = location;
    if (avatarUrl !== undefined) update.avatarUrl = avatarUrl;
    if (skillsWanted !== undefined) update.skillsWanted = Array.isArray(skillsWanted)
      ? skillsWanted
      : String(skillsWanted || '')?.split(',').map(s=>s.trim()).filter(Boolean);
    const me = await User.findByIdAndUpdate(req.userId, update, { new: true });
    res.json(me);
  }catch(e){ res.status(500).json({ error: e.message }); }
});

// Get a user's public profile
router.get('/:id', async (req, res) => {
  try{
    const u = await User.findById(req.params.id).select('-password').populate('skillsOffered');
    if (!u) return res.status(404).json({ msg: 'User not found' });
    res.json(u);
  }catch(e){ res.status(500).json({ error: e.message }); }
});

export default router;
