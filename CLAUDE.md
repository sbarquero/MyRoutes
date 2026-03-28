# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

This is a **non-managed monorepo** (no Turbo/Nx/workspaces) — each package has independent `node_modules` and must be run separately.

```
monorepo/
├── backend/    # Node.js + Express + MongoDB API
├── frontend/   # Vue 3 SPA
└── docker/     # Docker Compose orchestration for full-stack deployment
```

## Backend (`/backend`)

**Stack:** Node.js (v16 or v20, NOT v18), TypeScript, Express, MongoDB/Mongoose, SWC

```bash
cd backend
npm run dev          # Start dev server with nodemon + ts-node
npm run build        # Compile TypeScript via SWC → dist/
npm run start        # Build then run production server
npm run lint         # ESLint TypeScript files
npm run lint:fix     # Auto-fix ESLint issues
```

Environment: copy `.env.example` → `.env.development.local` (dev) or `.env.production.local` (prod).

API docs available at `http://localhost:3000/api-docs` (Swagger UI) when running.

### Backend Architecture

- **`src/server.ts`** — entry point: validates env vars, instantiates App with all routes
- **`src/app.ts`** — Express setup: DB connection, middleware stack, route registration, Swagger, error handling
- **`src/controllers/`** — route handlers (auth, user, track, configuration, index)
- **`src/routes/`** — route definitions that wire controllers to Express
- **`src/services/`** — business logic layer
- **`src/models/`** — Mongoose schemas (user, track, registerToken, resetToken)
- **`src/dtos/`** — Data Transfer Objects validated via `class-validator`
- **`src/middlewares/`** — Express middlewares
- **`src/config/`** — environment variable parsing with `envalid`
- **`src/databases/`** — MongoDB connection
- **`src/exceptions/`** — custom HTTP exception classes

Path aliases (e.g., `@controllers/*`, `@services/*`, `@models/*`) are defined in `tsconfig.json` and resolved at runtime via `tsconfig-paths` (dev) and `tsc-alias` (prod build).

## Frontend (`/frontend`)

**Stack:** Node.js (v16/v18/v20), TypeScript, Vue 3 (Composition API), Vite, Pinia, Vue Router, Bootstrap 5, Leaflet

```bash
cd frontend
npm run dev          # Vite dev server on port 8080
npm run build        # Type-check + Vite build → dist/
npm run type-check   # vue-tsc --noEmit only
npm run lint         # ESLint + auto-fix all .vue/.ts/.js files
npm run preview      # Preview production build on port 4173
```

Environment: copy `.env.example` → `.env.local` (Vite format: `VITE_` prefix for client-exposed vars).

### Frontend Architecture

- **`src/main.ts`** — registers Pinia, Vue Router, vue-i18n, mounts app
- **`src/router/`** — Vue Router config with route guards
- **`src/stores/`** — Pinia stores: `auth`, `user`, `track`, `global`
- **`src/api/`** — Axios API client modules per domain (auth, user, track, file, configuration)
- **`src/views/`** — page-level components routed by Vue Router
- **`src/components/`** — reusable components organized by feature (authentication, home, configuration, icons)
- **`src/i18n/`** — internationalization translation files
- **`src/interfaces/`** — TypeScript interfaces
- **`src/utils/`** — helper functions

Path alias `@` maps to `./src` (configured in `vite.config.ts` and `tsconfig.json`).

## Docker

Full-stack deployment via `docker/docker-compose.yml` spins up 4 containers:

| Container | Port |
|-----------|------|
| Frontend (Nginx) | 8080 |
| Backend (Node.js) | 3000 |
| MongoDB | 27018 |
| Mongo Express | 8081 |

Both `backend/` and `frontend/` also have their own `docker-compose.yml` for isolated development.

## API Surface

Backend REST API routes (base: `http://localhost:3000`):

- `GET /` — health check
- `/auth` — authentication (login, register, logout, email verification, password reset)
- `/user` — user management
- `/track` — GPS track CRUD (supports KML/GPX file upload via multer)
- `/file` — file operations
- `/Configuration` — app configuration

## Notes

- No test suite is configured in either package.
- Backend uses class-based controllers with TypeScript decorators.
- Frontend uses Vuelidate for form validation, SJCL for client-side encryption, and Turf.js for geospatial operations on top of Leaflet maps.
