# Loja CRUD (FastAPI + SQLite + React)

## Backend
- `uvicorn backend.server:app --reload`
- Banco: `sqlite:///./loja.db`
- Endpoints: `/categorias`, `/produtos`

## Frontend
- `cd frontend && npm install && npm run dev`
- Vite em `http://127.0.0.1:5173`
- Configure `VITE_API_URL` no `.env` do frontend se quiser trocar a URL da API.
