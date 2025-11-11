import mongoose from 'mongoose';

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: String, enum: ['Beginner','Intermediate','Expert'], default: 'Beginner' },
  description: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: String,
  location: String,
  availability: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Skill', SkillSchema);
