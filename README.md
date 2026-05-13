# PoliceWatch

A civic PWA for anonymously reporting law enforcement traffic violations. Submit dashcam or phone footage — AI validates the video, GPS auto-tags the location, and confirmed incidents appear on a public community map.

## Features

- **Video evidence** — upload dashcam footage or record live from your phone
- **AI validation** — Claude multimodal API analyzes extracted frames before publishing
- **GPS tagging** — auto-captures location and recorder speed; extracts real coordinates from GPS-enabled dashcam video metadata
- **Community map** — color-coded Leaflet map filtered by violation type and date range
- **Pattern analysis** — aggregate stats by violation type and repeat locations
- **Incident permalinks** — shareable report pages with PDF export
- **Admin review queue** — human review for AI-uncertain submissions
- **PWA** — installable, works offline, mobile-first

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript, Vite, Material UI, Redux Toolkit / RTK Query |
| Backend | Node.js + Express + TypeScript, Prisma |
| Database | Neon (serverless Postgres) |
| Storage | Cloudflare R2 (S3-compatible) |
| AI | Anthropic Claude API (multimodal frame analysis) |
| Map | Leaflet + react-leaflet |
| Deploy | Vercel (frontend) + Render (backend) |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) Postgres database
- A [Cloudflare R2](https://cloudflare.com) bucket with public access enabled
- An [Anthropic API key](https://console.anthropic.com)

### Backend setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in all values in .env
npx prisma migrate dev
npm run dev
```

### Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:3001
npm run dev
```

The frontend runs on HTTPS (`https://localhost:5173`) via `@vitejs/plugin-basic-ssl` — required for camera and GPS access on mobile.

### Environment Variables

See [`backend/.env.example`](backend/.env.example) and [`frontend/.env.example`](frontend/.env.example) for all required variables. Never commit `.env` files.

## Deployment

- **Backend → Render**: `backend/render.yaml` defines the service. Set all env vars in the Render dashboard.
- **Frontend → Vercel**: `frontend/vercel.json` handles SPA routing. Set `VITE_API_URL` to your Render backend URL.
- **R2 CORS**: Configure allowed origins in the Cloudflare R2 bucket settings to include your Vercel domain.

## Admin Panel

The admin panel at `/admin` allows reviewing AI-uncertain submissions. Protect it with a strong `ADMIN_PASSWORD` environment variable — the default in `.env.example` is for local development only.

## License

MIT
