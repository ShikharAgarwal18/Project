# Scalable Web App

This repository contains a full-stack web app with a React frontend and an Express/MongoDB backend.

## Structure

- `backend/` Node.js + Express + MongoDB API
- `frontend/` React (Vite) + Tailwind CSS

## Quickstart

### Backend

1. Copy environment file
```
cp backend/.env.example backend/.env
```
2. Adjust values in `backend/.env`.
3. Install dependencies and run dev server
```
cd backend
npm install
npm run dev
```
Server runs at `http://localhost:5000`.

### Frontend

1. Install dependencies and run dev server
```
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.

## API Overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (auth)
- `GET /api/users/me` (auth)
- `PUT /api/users/me` (auth)
- `GET /api/tasks` (auth, supports `?q=&status=`)
- `POST /api/tasks` (auth)
- `GET /api/tasks/:id` (auth)
- `PUT /api/tasks/:id` (auth)
- `DELETE /api/tasks/:id` (auth)

Include header `Authorization: Bearer <token>` for protected routes.

## Postman Collection

See `docs/postman_collection.json` (to be added) for ready-to-use requests.

## Scaling Notes

- Separate services, use env-based configs, and Docker for reproducible environments.
- Add rate limiting, request logging to ELK/Cloud, and monitoring.
- Use MongoDB Atlas or managed DB; add indexes for frequently queried fields.
- For frontend, enable code splitting, caching, and a dedicated API client with retries.
- Deploy with CI/CD (GitHub Actions) to a platform like Vercel (frontend) and Render/Fly.io (backend).
