import express from 'express';
import Message from '../models/Message.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authRequired, async (req, res) => {
  try {
    const { to, content } = req.body;
    const m = await Message.create({ from: req.userId, to, content });
    res.json(m);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:peerId', authRequired, async (req, res) => {
  const { peerId } = req.params;
  try {
    const msgs = await Message.find({ $or: [
      { from: req.userId, to: peerId },
      { from: peerId, to: req.userId }
    ]}).sort('createdAt');
    res.json(msgs);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

export default router;
