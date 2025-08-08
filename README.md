# AI App/Website Builder (React + Node)

A professional, free, AI-powered WebApp that generates full-stack apps (frontend + backend) from prompts or templates.

- Frontend: React (Vite) + Tailwind CSS + Axios
- Backend: Node.js + Express
- AI: OpenRouter (or fallback basic templates)
- Storage: JSON file (local) with optional MongoDB in future

## Features
- Prompt input, type selector (Mobile App, Website, WebApp)
- Template library (Portfolio, Business, Blog, E-Commerce)
- AI code generation (OpenRouter) with fallback
- Live preview in iframe
- Export code as ZIP (client-side)
- Save projects (requires login)
- Simple auth (email/password, JWT). Google Login optional (future).

## Quickstart

### 1) Backend

```bash
cd backend
cp .env.example .env
# edit .env as needed (JWT_SECRET, OPENROUTER_API_KEY optional)
npm install
npm run dev
```

Server runs on http://localhost:5001

### 2) Frontend

```bash
cd frontend
cp .env.example .env
# edit VITE_API_BASE if backend runs on another host
npm install
npm run dev
```

App runs on http://localhost:5173

Login with a new account (register), then generate and save.

## Environment

Backend `.env`:
- PORT=5001
- JWT_SECRET=change_this
- CORS_ORIGIN=http://localhost:5173
- OPENROUTER_API_KEY=your_key_here (optional)
- OPENROUTER_BASE=https://openrouter.ai/api/v1
- OPENROUTER_MODEL=openai/gpt-4o-mini

Frontend `.env`:
- VITE_API_BASE=http://localhost:5001

## Deploy (basic)
- Backend: Deploy on any Node host (Railway, Render, Fly). Set env vars, run `npm start`.
- Frontend: Build `npm run build`, deploy `dist` to static host (Vercel/Netlify). Set `VITE_API_BASE` to backend URL at build time.

## Notes
- Without `OPENROUTER_API_KEY`, the generator returns a basic template.
- Data is stored in `backend/data/*.json`. For production, use a real DB.
