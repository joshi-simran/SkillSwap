import mongoose from 'mongoose';
import 'dotenv/config';
import User from '../models/User.js';
import Skill from '../models/Skill.js';
import Match from '../models/Match.js';
import Message from '../models/Message.js';
import Feedback from '../models/Feedback.js';
import bcrypt from 'bcryptjs';

async function run(){
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected');
  await Promise.all([
    User.deleteMany({}),
    Skill.deleteMany({}),
    Match.deleteMany({}),
    Message.deleteMany({}),
    Feedback.deleteMany({})
  ]);

  const pass = await bcrypt.hash('password123', 10);

  const a = await User.create({ name:'Alex', email:'alex@example.com', password:pass, skillsWanted:['Guitar'] });
  const b = await User.create({ name:'Bianca', email:'bianca@example.com', password:pass, skillsWanted:['Python'] });
  const c = await User.create({ name:'Chen', email:'chen@example.com', password:pass, skillsWanted:['React'] });

  const s1 = await Skill.create({ name:'Python', level:'Expert', description:'Data analysis mentoring', owner:a._id, category:'Tech', location:'Remote', availability:'Weeknights' });
  const s2 = await Skill.create({ name:'Guitar', level:'Intermediate', description:'Acoustic basics', owner:b._id, category:'Music', location:'Mumbai', availability:'Weekends' });
  const s3 = await Skill.create({ name:'React', level:'Intermediate', description:'Hooks and state', owner:c._id, category:'Tech', location:'Remote', availability:'Flexible' });

  await User.findByIdAndUpdate(a._id, { $push: { skillsOffered: s1._id }});
  await User.findByIdAndUpdate(b._id, { $push: { skillsOffered: s2._id }});
  await User.findByIdAndUpdate(c._id, { $push: { skillsOffered: s3._id }});

  console.log('Seeded users:', a.email, b.email, c.email);
  await mongoose.disconnect();
}
run().catch(e=>{console.error(e); process.exit(1)});
