# Backend API

Node.js + Express + PostgreSQL API for authenticated personal finance tracking.

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
  config/       # env + database configuration
  controllers/  # request/response orchestration
  middleware/   # auth, validation, error handling
  routes/       # endpoint declarations
  services/     # business rules + SQL queries
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

1. Create the database:

```sql
CREATE DATABASE financial_tracker;
```

2. Import the schema:

```bash
psql "postgresql://postgres:postgres@localhost:5432/financial_tracker" -f schema.sql
```

3. Optional demo data:

```bash
npm run seed:demo
```

SQL demo seed for presentations:

```bash
psql "postgresql://postgres:postgres@localhost:5432/financial_tracker" -f demo_seed.sql
```

Seeded demo credentials:

- Email: `demo@flowledger.com`
- Password: `DemoPass123!`

## Local PostgreSQL Shortcuts

This repo already includes PostgreSQL binaries in `.local-postgres`.

Start the bundled local database:

```bash
npm run db:start-local
```

Reset the local database to schema + demo data:

```bash
npm run db:reset-demo
```

DBeaver connection settings for the bundled database:

- Host: `localhost`
- Port: `5432`
- Database: `financial_tracker`
- Username: `postgres`
- Password: `postgres`

## Run

```bash
npm install
npm run dev
```

## Verify

```bash
npm run verify
```

## Routes

### Health

- `GET /api/health`

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Frontend Handshake Compatibility

- `POST /users`
- `POST /users/register`
- `POST /users/login`
- `GET /users`
- `GET /users/me`

These routes mirror the Week 7 React fetch handout while staying user-safe:

- `POST /users` and `POST /users/register` create an account and return a JWT
- `POST /users/login` signs in and returns a JWT
- `GET /users/me` returns the signed-in user profile
- `GET /users` returns only the signed-in user as a one-item array for compatibility with list-based React examples

All other app data stays behind the same `Authorization: Bearer <token>` protection as the private `/api/*` routes.

### Categories

- `GET /api/categories`
- `GET /api/categories/:id`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`

### Transactions

- `GET /api/transactions`
- `GET /api/transactions/:id`
- `POST /api/transactions`
- `PUT /api/transactions/:id`
- `DELETE /api/transactions/:id`

### Budgets

- `GET /api/budgets`
- `GET /api/budgets/:id`
- `POST /api/budgets`
- `PUT /api/budgets/:id`
- `DELETE /api/budgets/:id`

### Dashboard

- `GET /api/dashboard/summary`

## Security Controls

- Passwords are stored only as `bcrypt` hashes
- JWT is required for all private routes
- Protected queries are user-scoped with `WHERE user_id = $1`
- Composite foreign keys enforce category ownership
- Validation middleware returns structured field errors
- Database uniqueness and check constraints backstop application rules

## Marker Workflow

1. Import `postman/Financial_Tracker_Postman_Collection.json`
2. Set `baseUrl` to `http://localhost:5000/api` or your deployed URL
3. Register or log in
4. Reuse the saved bearer token for protected routes
5. Run CRUD requests for categories, transactions, and budgets
6. Run `GET /dashboard/summary` to verify SQL aggregation

## Presentation Support

- SQL walkthrough: `backend/SQL_PRESENTATION_NOTES.md`
- Demo data script: `backend/demo_seed.sql`

## Render Deployment

1. Create a Render Web Service from this repository.
2. Set **Root Directory** to `backend`.
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables:
   - `PORT`
   - `DATABASE_URL`
   - `JWT_SECRET`
6. Run `schema.sql` against the attached PostgreSQL database.
