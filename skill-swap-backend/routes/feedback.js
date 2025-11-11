import express from 'express';
import Feedback from '../models/Feedback.js';
import Match from '../models/Match.js';
import User from '../models/User.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

// Create feedback for a completed match
router.post('/', authRequired, async (req, res) => {
  try{
    const { matchId, to, rating, comment } = req.body;
    if (!matchId || !to || !rating) return res.status(400).json({ msg: 'matchId, to, rating required' });
    const m = await Match.findById(matchId);
    if (!m || m.status !== 'completed') return res.status(400).json({ msg: 'Match not completed' });
    if (![String(m.userA), String(m.userB)].includes(String(req.userId))) return res.status(403).json({ msg: 'Not allowed' });
    if (![String(m.userA), String(m.userB)].includes(String(to))) return res.status(400).json({ msg: 'Target not part of match' });

    const fb = await Feedback.create({ match: matchId, from: req.userId, to, rating, comment });

    // Update target user's aggregate rating
    const target = await User.findById(to);
    const total = (target.rating || 0) * (target.ratingCount || 0) + Number(rating);
    const count = (target.ratingCount || 0) + 1;
    target.rating = Number((total / count).toFixed(2));
    target.ratingCount = count;
    await target.save();

    res.json(fb);
  }catch(e){ res.status(500).json({ error: e.message }); }
});

// List feedback received by a user
router.get('/user/:id', async (req, res) => {
  try{
    const list = await Feedback.find({ to: req.params.id }).sort('-createdAt').populate('from', 'name');
    res.json(list);
  }catch(e){ res.status(500).json({ error: e.message }); }
});

export default router;
