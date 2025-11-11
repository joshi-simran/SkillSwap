import mongoose from 'mongoose';
import 'dotenv/config';
import User from '../models/User.js';
import Skill from '../models/Skill.js';
import Match from '../models/Match.js';
import Message from '../models/Message.js';
import Feedback from '../models/Feedback.js';

async function run(){
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI not set');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');
  const results = await Promise.all([
    User.deleteMany({}),
    Skill.deleteMany({}),
    Match.deleteMany({}),
    Message.deleteMany({}),
    Feedback.deleteMany({})
  ]);
  console.log('Deleted counts:', {
    users: results[0].deletedCount,
    skills: results[1].deletedCount,
    matches: results[2].deletedCount,
    messages: results[3].deletedCount,
    feedbacks: results[4].deletedCount,
  });
  await mongoose.disconnect();
  console.log('Reset complete.');
}

run().catch(e=>{ console.error(e); process.exit(1); });
