# Fibo Scene Generator

A small React + Express app to generate images via a FIBO-like API using a JSON-controlled UI. Includes demo mode (no API key needed), a prompt-to-JSON helper, and a simple in-memory history.

## Features
- JSON-driven scene controls (subject, camera, lighting, color)
- `/api/generate` server proxy that normalizes responses: `{ success, image, status, raw }`
- Demo mode with placeholder images (no external calls)
- Prompt to JSON: `POST /api/prompt/convert`
- Basic history: `GET/POST /api/history`

## Stack
- Client: React 18, Vite, Tailwind
- Server: Node, Express, Axios, dotenv, CORS

## Quick Start

### 1) Setup env vars
Copy the examples and adjust values as needed.

```bash
# server
cp .env.example .env
# client
cp client/.env.example client/.env
```

Set `DEMO_MODE=true` to use demo images. For real API calls set `DEMO_MODE=false` and provide `FIBO_URL` and `FIBO_API_KEY`.

### 2) Install deps
```bash
npm install --prefix server
npm install --prefix client
```

### 3) Run dev
- Start server (http://localhost:5000)
```bash
npm run dev --prefix server
```
- Start client (http://localhost:5173) with proxy `/api -> http://localhost:5000`
```bash
npm run dev --prefix client
```

### 4) Build
```bash
npm run build --prefix client
npm start --prefix server
```

## API
- `POST /api/generate` body: `{ payload: any }` → `{ success, image, status, raw }`
- `POST /api/prompt/convert` body: `{ prompt: string }`
- `POST /api/history/add` body: `{ prompt, json, imageUrl }`
- `GET /api/history`

## Notes
- In-memory history resets on server restart.
- CORS is open for dev; restrict in production.
- Do not expose your `FIBO_API_KEY` to the client.
