import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema({
  match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Feedback', FeedbackSchema);
