import mongoose from 'mongoose';

const MatchSchema = new mongoose.Schema({
  userA: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userB: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  skillAtoB: String,
  skillBtoA: String,
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending','connected','completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Match', MatchSchema);
