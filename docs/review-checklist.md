# Sprint Review Evidence Checklist

Use this during a resubmission or live review so the instructor can verify the project quickly.

## 1. Show the database structure

- Open [database/schema.sql](/C:/Users/regan/Desktop/personal-finance-tracker/database/schema.sql)
- Point out the `users` table and the `categories` table
- Mention that `categories.user_id` is linked to `users.id`

## 2. Show password hashing

1. Send `POST /api/auth/register` with a test user
2. Open the database and run:

```sql
SELECT id, username, email, password
FROM users
ORDER BY id DESC;
```

3. Screenshot the result so the password column shows a bcrypt hash, not the plain password

## 3. Show login and token auth

1. Send `POST /api/auth/login`
2. Copy the returned JWT token
3. Use `Authorization: Bearer <token>` on protected routes

## 4. Show CRUD clearly

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

## 5. Be honest about git history

- Do not try to fake old commits after the fact
- For the next sprint, commit regularly with small descriptive messages
- Good examples:
  - `add user login route`
  - `protect categories endpoints with jwt middleware`
  - `build react dashboard shell`
