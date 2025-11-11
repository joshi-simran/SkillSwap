import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: String,
  location: String,
  skillsOffered: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  skillsWanted: [{ type: String }],
  rating: { type: Number, default: 5 },
  ratingCount: { type: Number, default: 0 },
  avatarUrl: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema);
