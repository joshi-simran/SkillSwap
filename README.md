# SkillSwap 

Frontend: React + Vite  
Backend: Node/Express + MongoDB

## Quick Start

### Backend
```bash
cd skill-swap-backend
npm install
cp .env.example .env
# edit MONGO_URI and JWT_SECRET
npm run seed   # optional sample data
npm run dev    # starts on :5000
```

### Frontend
```bash
cd skill-swap-frontend
npm install
cp .env.example .env
npm run dev    # opens on :5173
```

Ensure `.env` values:
- Backend `CLIENT_ORIGIN=http://localhost:5173`
- Frontend `VITE_API_URL=http://localhost:5000/api`

Production: build frontend (`npm run build`) and either serve via separate static host or copy `skill-swap-frontend/dist` into `skill-swap-backend/public` and set `SERVE_CLIENT=true`.

### Created By
Shubashitha Gowtham
Simran Joshi
Sruthi Vejju