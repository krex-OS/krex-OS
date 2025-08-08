# Backend

Node.js + Express server for AI Builder.

- Auth: JWT, file-based users in `data/users.json`
- Projects: CRUD in `data/projects.json`
- Generate: OpenRouter-backed AI code gen with fallback templates

## Run

```bash
cp .env.example .env
npm install
npm run dev
```