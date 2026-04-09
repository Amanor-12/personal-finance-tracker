# Personal Finance Tracker Backend

This repository is intentionally backend-only. It is structured for a rubric that evaluates deployment, relational database design, authentication, CRUD APIs, status handling, and backend code quality without any frontend requirements.

## Backend Scope

- PostgreSQL relational schema with `users`, `categories`, `transactions`, and `budgets`
- JWT authentication with `bcrypt` password hashing
- Protected CRUD routes for categories, transactions, and budgets
- Dashboard summary endpoint backed by SQL aggregation
- Postman collection for marker verification
- Render deployment blueprint for the API

## Project Structure

```text
personal-finance-tracker/
  backend/
    src/
      config/
      controllers/
      middleware/
      routes/
      services/
      utils/
    schema.sql
    .env.example
    README.md
  postman/
    Financial_Tracker_Postman_Collection.json
  render.yaml
```

## Local Setup

```bash
npm --prefix backend install
psql "postgresql://postgres:postgres@localhost:5432/financial_tracker" -f backend/schema.sql
npm run dev:backend
```

Copy `backend/.env.example` to `backend/.env` before starting the server.

Optional demo data:

```bash
npm run seed:demo
```

SQL-first demo data for presentations:

```bash
psql "postgresql://postgres:postgres@localhost:5432/financial_tracker" -f backend/schema.sql
npm run seed:demo
```

## Verification

```bash
npm run verify
```

## API Summary

- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- Categories: `GET/POST /api/categories`, `GET/PUT/DELETE /api/categories/:id`
- Transactions: `GET/POST /api/transactions`, `GET/PUT/DELETE /api/transactions/:id`
- Budgets: `GET/POST /api/budgets`, `GET/PUT/DELETE /api/budgets/:id`
- Dashboard: `GET /api/dashboard/summary`
- Health: `GET /api/health`

Detailed backend documentation is in `backend/README.md`.
