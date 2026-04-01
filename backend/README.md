# Backend - FlowLedger API

Node.js + Express + PostgreSQL API for authenticated financial tracking.

## Stack

- Express
- PostgreSQL (`pg`)
- JWT authentication
- `bcrypt` password hashing
- `dotenv`
- CORS

## Architecture

```text
backend/src/
  config/       # env + database config
  controllers/  # req/res orchestration only
  middleware/   # auth, validation, error handling
  routes/       # endpoint declarations only
  services/     # business logic + SQL queries
  utils/        # reusable helpers
```

## Environment

Copy `backend/.env.example` to `backend/.env`:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/financial_tracker
JWT_SECRET=replace_with_a_long_secure_secret
```

## Database Setup

1. Create database:

```sql
CREATE DATABASE financial_tracker;
```

2. Import schema:

```bash
psql "postgresql://postgres:postgres@localhost:5432/financial_tracker" -f schema.sql
```

## Run

```bash
npm install
npm run dev
```

## API Routes

### Health

- `GET /api/health`

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (protected)

### Categories (protected)

- `GET /api/categories`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`

### Transactions (protected)

- `GET /api/transactions`
- `GET /api/transactions/:id`
- `POST /api/transactions`
- `PUT /api/transactions/:id`
- `DELETE /api/transactions/:id`

### Budgets (protected)

- `GET /api/budgets`
- `POST /api/budgets`
- `PUT /api/budgets/:id`
- `DELETE /api/budgets/:id`

### Dashboard (protected)

- `GET /api/dashboard/summary`

## Security Controls

- Passwords stored only as `bcrypt` hashes (`users.password_hash`)
- JWT required for all non-auth/private routes
- Auth middleware attaches user ID to `req.user`
- Every query is user-scoped (`WHERE user_id = $1`)
- Foreign-key ownership constraints enforce user-to-category-to-record integrity
- Validation middleware returns structured field errors for invalid input

## Render Deployment (Web Service)

1. Create a new Render Web Service from this repository.
2. Set **Root Directory** to `backend`.
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables:
   - `PORT`
   - `DATABASE_URL`
   - `JWT_SECRET`
6. Attach a PostgreSQL instance and run `schema.sql` against it.

