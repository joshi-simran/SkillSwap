import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const CONFIRM_FLAG = '--yes';
if (!process.argv.includes(CONFIRM_FLAG)) {
  console.error('Aborted: run with --yes to actually delete data.');
  console.error('Example: node scripts/wipeUsers.js --yes');
  process.exit(1);
}

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('MONGO_URI not set in .env');
  process.exit(1);
}

async function tryDeleteByModel(path, name) {
  try {
    const mod = (await import(path)).default;
    const res = await mod.deleteMany({});
    console.log(`${name}: deleted ${res.deletedCount ?? 'unknown'} documents (via model)`);
  } catch (e) {
    // ignore if model not found — will try collection fallback
  }
}

async function deleteCollectionsFallback(names) {
  for (const n of names) {
    try {
      const col = mongoose.connection.collection(n);
      if (col) {
        const res = await col.deleteMany({});
        console.log(`${n}: deleted ${res.deletedCount} documents (collection)`);
      }
    } catch (e) {
      console.warn(`${n}: collection delete failed or does not exist`);
    }
  }
}

async function main(){
  await mongoose.connect(uri, { dbName: undefined, autoCreate: false });
  console.log('Connected to DB');

  // try delete via known models (adjust paths if your project differs)
  await Promise.allSettled([
    tryDeleteByModel('../models/User.js', 'User'),
    tryDeleteByModel('../models/Match.js', 'Match'),
    tryDeleteByModel('../models/Message.js', 'Message'),
    tryDeleteByModel('../models/Skill.js', 'Skill'),
    tryDeleteByModel('../models/Review.js', 'Review')
  ]);

  // fallback: delete common collection names
  await deleteCollectionsFallback(['users','matches','messages','skills','reviews','sessions']);

  // as a last step, optionally compact / report
  console.log('Wipe completed. Disconnecting...');
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err=>{
  console.error('Error:', err);
  process.exit(1);
});