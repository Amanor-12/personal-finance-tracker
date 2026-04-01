# FlowLedger Financial Tracker

FlowLedger is a production-style full-stack financial tracker built for SERN/Open Full Source Stack coursework with a Level 5 rubric target. It includes secure authentication, relational PostgreSQL data modeling, full CRUD modules, and a premium SaaS-style frontend experience.

## Tech Stack

- Frontend: React + Vite + React Router + Fetch API (JavaScript only)
- Backend: Node.js + Express + PostgreSQL (`pg`) + JWT + `bcrypt`
- Database: PostgreSQL (DBeaver-ready relational schema)
- Deployment targets: Render Web Service (backend) + Render Static Site (frontend)

## Key Features

- Secure registration and login with password hashing (`bcrypt`)
- JWT-based protected routes for all private API domains
- User ownership isolation for categories, transactions, budgets, and dashboard data
- Full CRUD for categories, transactions, and budgets
- Real SQL dashboard aggregation (`SUM`, `GROUP BY`, monthly trends, budget utilization)
- Polished responsive fintech dashboard UI (loading, empty, success, and error states)

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
  frontend/
    src/
      components/
      hooks/
      pages/
      services/
      styles/
      utils/
    public/_redirects
    .env.example
    README.md
  docs/
    DBEAVER_SETUP.md
  postman/
    Financial_Tracker_Postman_Collection.json
  render.yaml
```

## Local Setup

1. Install dependencies:

```bash
npm --prefix backend install
npm --prefix frontend install
```

2. Create and configure environment files:

- `backend/.env` from `backend/.env.example`
- `frontend/.env` from `frontend/.env.example`

3. Create database and import schema:

```bash
psql "postgresql://postgres:postgres@localhost:5432/financial_tracker" -f backend/schema.sql
```

4. Start backend and frontend:

```bash
npm run dev:backend
npm run dev:frontend
```

5. Open:

- Frontend: `http://localhost:5173`
- Backend health: `http://localhost:5000/api/health`

## Environment Variables

### Backend (`backend/.env`)

- `PORT=5000`
- `DATABASE_URL=postgresql://...`
- `JWT_SECRET=your_secure_secret`

### Frontend (`frontend/.env`)

- `VITE_API_URL=http://localhost:5000/api`

## API Summary

- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- Categories: `GET/POST /api/categories`, `PUT/DELETE /api/categories/:id`
- Transactions: `GET/POST /api/transactions`, `GET/PUT/DELETE /api/transactions/:id`
- Budgets: `GET/POST /api/budgets`, `PUT/DELETE /api/budgets/:id`
- Dashboard: `GET /api/dashboard/summary`

Detailed route references are in [backend/README.md](./backend/README.md).

## DBeaver + Postman

- DBeaver guide: [docs/DBEAVER_SETUP.md](./docs/DBEAVER_SETUP.md)
- Postman collection: [postman/Financial_Tracker_Postman_Collection.json](./postman/Financial_Tracker_Postman_Collection.json)

## Render Deployment

- Backend deploy instructions: [backend/README.md](./backend/README.md)
- Frontend deploy instructions: [frontend/README.md](./frontend/README.md)
- Optional blueprint: [render.yaml](./render.yaml)

## Demo Day Walkthrough

1. Register a new account.
2. Log in and review dashboard baseline values.
3. Create or edit categories.
4. Add income and expense transactions.
5. Create a monthly budget.
6. Return to dashboard and show real-time updates:
   - income, expenses, balance
   - category breakdown
   - budget utilization
   - recent activity
7. Edit and delete records to prove full CRUD + instant UI updates.

