# Frontend - FlowLedger UI

React + Vite financial tracker client with protected routing, modular component architecture, and live integration with the FlowLedger API.

## Stack

- React (JavaScript only)
- React Router
- Fetch API
- `useState` + `useEffect`
- Vite

## Structure

```text
frontend/src/
  components/   # reusable UI primitives + feature blocks
  hooks/        # auth session + app data refresh coordination
  pages/        # route-level orchestration
  services/     # API modules
  styles/       # global tokens + component design system
  utils/        # formatting and validation helpers
```

## Environment

Copy `frontend/.env.example` to `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Run

```bash
npm install
npm run dev
```

App runs on `http://localhost:5173`.

## UX Features

- Register/Login flows with validation and feedback alerts
- Protected routes with session restoration on refresh
- SaaS-style responsive app shell (sidebar + topbar)
- Reusable cards, forms, alert banners, empty states, loading states, dialogs
- Instant UI updates after create/update/delete actions (no full page refresh)
- Dashboard auto-refresh triggered by transactions and budgets changes

## Pages

- `/login`
- `/register`
- `/dashboard`
- `/transactions`
- `/categories`
- `/budgets`

## Build

```bash
npm run build
```

Build output: `dist`

## Render Deployment (Static Site)

1. Create a new Render Static Site.
2. Set **Root Directory** to `frontend`.
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variable:
   - `VITE_API_URL` = deployed backend base URL + `/api`
6. Keep `public/_redirects` to support SPA routing.

