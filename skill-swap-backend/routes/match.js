import express from 'express';
import User from '../models/User.js';
import Match from '../models/Match.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

router.post('/find', authRequired, async (req, res) => {
  try {
    const me = await User.findById(req.userId).populate('skillsOffered');
    if (!me) return res.status(404).json({ msg: 'User not found' });
    const others = await User.find({ _id: { $ne: me._id } }).populate('skillsOffered');

    const suggestions = [];
    const myOffered = me.skillsOffered.map(s => s.name.toLowerCase());
    const myWanted = (me.skillsWanted || []).map(s => s.toLowerCase());

    for (const u of others) {
      const theyOffer = u.skillsOffered.map(s => s.name.toLowerCase());
      const theyWant = (u.skillsWanted || []).map(s => s.toLowerCase());

      const offerToMe = theyOffer.find(x => myWanted.includes(x));
      const offerToThem = myOffered.find(x => theyWant.includes(x));

      // Only suggest if both sides have reciprocal match
      if (offerToMe && offerToThem) {
        suggestions.push({
          partnerId: u._id,
          partnerName: u.name,
          theyOffer: offerToMe,
          reciprocal: true,
          theyWant: offerToThem,
          theirOfferedSkills: u.skillsOffered.map(s => ({ id: s._id, name: s.name, level: s.level }))
        });
      }
    }
    res.json({ suggestions });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Create a connection/match between two users
router.post('/connect', authRequired, async (req, res) => {
  try {
    const { partnerId, skillAtoB, skillBtoA } = req.body; // current user -> partner, partner -> current user
    if (!partnerId) return res.status(400).json({ msg: 'partnerId required' });
    const existing = await Match.findOne({
      $or: [
        { userA: req.userId, userB: partnerId },
        { userA: partnerId, userB: req.userId }
      ],
      status: { $ne: 'completed' }
    });
    if (existing) return res.json(existing);
    // Create a pending request; will be connected on accept
    const m = await Match.create({ userA: req.userId, userB: partnerId, skillAtoB, skillBtoA, requestedBy: req.userId, status: 'pending' });
    res.json(m);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// List my matches
router.get('/my', authRequired, async (req, res) => {
  try {
    const ms = await Match.find({ $or: [{ userA: req.userId }, { userB: req.userId }] }).sort('-createdAt')
      .populate('userA', 'name')
      .populate('userB', 'name')
      .lean();

    // Collect unique user IDs to fetch their offered skills
    const userIds = Array.from(new Set(ms.flatMap(m => [String(m.userA?._id || m.userA), String(m.userB?._id || m.userB)])));
    const users = await User.find({ _id: { $in: userIds } }).populate('skillsOffered').lean();
    const userMap = new Map(users.map(u => [String(u._id), u]));

    const enriched = ms.map(m => {
      const aId = String(m.userA?._id || m.userA);
      const bId = String(m.userB?._id || m.userB);
      const a = userMap.get(aId);
      const b = userMap.get(bId);
      const findSkill = (u, name) => {
        if (!u || !name) return null;
        const n = String(name).toLowerCase();
        return (u.skillsOffered || []).find(s => String(s.name).toLowerCase() === n) || null;
      };
      const detailA = findSkill(a, m.skillAtoB);
      const detailB = findSkill(b, m.skillBtoA);
      return { ...m, detailA, detailB };
    });

    res.json(enriched);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Respond to a pending match (accept or reject)
router.post('/respond', authRequired, async (req, res) => {
  try {
    const { matchId, action } = req.body;
    const m = await Match.findById(matchId);
    if (!m) return res.status(404).json({ msg: 'Match not found' });
    if (![String(m.userA), String(m.userB)].includes(String(req.userId))) return res.status(403).json({ msg: 'Not allowed' });
    if (m.status !== 'pending') return res.status(400).json({ msg: 'Match is not pending' });
    // Only the non-requester should accept or reject
    if (String(m.requestedBy) === String(req.userId)) return res.status(400).json({ msg: 'Requester cannot respond' });
    if (action === 'accept') {
      m.status = 'connected';
      await m.save();
      return res.json(m);
    } else if (action === 'reject') {
      await m.deleteOne();
      return res.json({ ok: true });
    } else {
      return res.status(400).json({ msg: 'Invalid action' });
    }
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Complete a match
router.post('/complete', authRequired, async (req, res) => {
  try {
    const { matchId } = req.body;
    const m = await Match.findById(matchId);
    if (!m) return res.status(404).json({ msg: 'Match not found' });
    if (![String(m.userA), String(m.userB)].includes(String(req.userId))) return res.status(403).json({ msg: 'Not allowed' });
    m.status = 'completed';
    await m.save();
    res.json(m);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

export default router;

