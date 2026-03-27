# Personal Finance Tracker

This project now includes:

- an Express API for Sprint 1 and auth practice
- a React + Vite frontend for Sprint 2
- a mock single-page dashboard shell with local state, validation, and reusable components
- a SQL schema file and review checklist to make instructor verification easier

## Run locally

Backend:

```bash
npm install
npm run dev
```

Frontend:

```bash
cd client
npm install
npm run dev
```

Open the frontend at `http://localhost:5173` and the API at `http://localhost:3000/api`.

## Render environment variables

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_SSL`
- `DB_SSL_REJECT_UNAUTHORIZED`
- `DB_SSL_CA` if your provider gives you a CA certificate
- `JWT_SECRET`

## API routes

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Users

- `GET /api/users`
- `GET /api/users/:id`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`

### Categories

- `GET /api/categories`
- `GET /api/categories/:id`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`

## Sprint 2 review talking points

- `client/src/App.jsx` owns shared state for transactions, budgets, goals, and activity.
- `TransactionForm`, `BudgetPlanner`, and `GoalTracker` are controlled, reusable form components.
- `useEffect` is used for document title updates, local storage persistence, and toast cleanup.
- Navigation is a seamless SPA shell driven by React state instead of full-page reloads.

## Deployment

A `render.yaml` file is included so the project is ready for a Render web service build that:

1. installs root dependencies
2. installs frontend dependencies
3. builds the React app
4. serves the built frontend from the Express app

## Instructor verification

- Database structure: [database/schema.sql](/C:/Users/regan/Desktop/personal-finance-tracker/database/schema.sql)
- Review checklist: [docs/review-checklist.md](/C:/Users/regan/Desktop/personal-finance-tracker/docs/review-checklist.md)
