# Fibo Scene Generator

Fibo Scene Generator is a full‑stack web application that converts natural-language prompts into scene parameters and generates images. It ships with a React + Vite frontend and an Express backend. The project includes a demo mode (no API keys required) and local persistence for generation history.

This README will help you get the project running locally, explain available API endpoints, and highlight the project's logging and persistence behavior.

---

## Key Features

- Natural-language prompt → structured JSON scene parameters
- Image generation (demo mode uses Unsplash images; production uses OpenAI image API)
- Persistent history stored locally (using `lowdb` JSON file)
- Clean responsive UI built with Tailwind CSS
- Structured server logging with `winston` and request logging via `morgan`

---

## Tech stack

- Frontend: React 18, Vite, Tailwind CSS
- Backend: Node.js (ES modules), Express
- Persistence: lowdb (file-based JSON DB for local use)
- Logging: winston (file + console), morgan (HTTP request logging)

---

## Quick Start (Development)

Prerequisites: Node.js 18+ and npm

1. Clone the repository

```bash
git clone https://github.com/VijayPawar09/Fibo_Scene_Generator.git
cd Fibo_Scene_Generator
```

2. Install server dependencies and run the server

```bash
cd server
npm install
# create .env (see .env.example or the Env section below)
npm run dev
```

3. Install client dependencies and run the frontend

```bash
cd ../client
npm install
npm run dev
```

Open the UI at: http://localhost:5173 (Vite will print the exact URL). The backend runs at http://localhost:5000 by default.

---

## Environment Variables

Create a `.env` file in the `server/` folder with at least the following keys (an example may be present as `.env.example`):

- `DEMO_MODE=true|false` — when `true`, the server returns demo Unsplash images instead of calling the image API (useful for local testing)
- `OPENAI_API_KEY=` — your OpenAI API key (only required if `DEMO_MODE=false`)
- `PORT=` — optional (defaults to `5000`)

Important: Never commit `.env` or API keys to the repository. The repository contains push-protection rules and secret scanning; do not push secrets.

---

## Persistence & Logs

- History is persisted locally in `server/db.json` using `lowdb`. The controller `server/controller/historyController.js` reads/writes this file.
- Logs are written to `server/logs/combined.log` and `server/logs/error.log` via `winston`. HTTP requests are also logged using `morgan`.

If you want a production-grade DB, replace `lowdb` with MongoDB / Postgres and update the controller accordingly.

---

## Server API (Overview)

Base URL: `http://localhost:5000/api`

Endpoints:

- POST `/api/fibo/generate-image`

  - Body: { description, camera_angle, lighting, color_palette, resolution }
  - Response (demo): `{ success: true, data: { image_url, status } }`

- POST `/api/prompt/convert`

  - Body: { prompt }
  - Response: `{ success: true, json: { scene, camera, lighting, color_palette } }`

- POST `/api/history/add`

  - Body: `{ prompt, json, imageUrl }`
  - Response: `{ success: true, entry }`

- GET `/api/history`

  - Response: `{ success: true, history: [...] }`

- POST `/api/generate` (alternate route used by `client/src/pages/Generate.jsx`)
  - Body: `{ prompt, size }` (demo mode returns an Unsplash URL or production returns a base64 data URL)

Example (cURL) — add history:

```bash
curl -X POST http://localhost:5000/api/history/add \
	-H "Content-Type: application/json" \
	-d '{"prompt":"A serene lake at sunset", "json":{}, "imageUrl":"https://..."}'
```

---

## Error handling & logs

- The server uses `winston` to capture structured logs to `server/logs/` and also prints to console.
- A global error handler is registered in `server.js` which returns a 500 JSON response for unhandled errors and logs a stack trace.
- HTTP requests are logged (combined format) via `morgan` and forwarded to the `winston` logger.

If you see failures when pushing to GitHub, check the logs and make sure `.env` wasn't accidentally committed — GitHub Push Protection may block pushes containing secrets.

---

## Troubleshooting

- Server crashes with `lowdb: missing default data` — ensure `server/db.js` is present and writable; the server creates `db.json` automatically on first run.
- Port in use — set `PORT` in `.env` or stop the process using the port (Windows: `netstat -ano | findstr :5000` then `taskkill /PID <pid> /F`).
- Demo images not appearing — confirm `DEMO_MODE=true` in `server/.env`.

If you run into issues, check `server/logs/combined.log` and `server/logs/error.log` for details.

---

## Contributing

Contributions are welcome! Please open issues or pull requests. When contributing:

- Keep secrets out of commits (use `.env` files)
- Run the server and client locally and verify no regressions
- Format code consistently (Prettier / ESLint if available)

---

## License

This project is available under the MIT License.

---

If you'd like, I can also generate a `CONTRIBUTING.md`, `.env.example`, and a short developer checklist. Want me to add those now?
