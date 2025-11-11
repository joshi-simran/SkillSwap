import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import skillRoutes from './routes/skills.js';
import matchRoutes from './routes/match.js';
import messageRoutes from './routes/messages.js';
import profileRoutes from './routes/profile.js';
import feedbackRoutes from './routes/feedback.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// CORS
const allowed = process.env.CLIENT_ORIGIN?.split(',').map(s => s.trim()) || ['http://localhost:5173'];
app.use(cors({ origin: allowed, credentials: true }));

app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/feedback', feedbackRoutes);

// Optional: serve a production build if copied into backend/public
if (process.env.SERVE_CLIENT === 'true') {
  app.use(express.static(path.join(__dirname, 'public')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

mongoose.connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
