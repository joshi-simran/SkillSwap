import mongoose from 'mongoose';

const MsgSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Message', MsgSchema);
