# DBeaver Setup Guide (PostgreSQL)

This guide configures DBeaver for FlowLedger and verifies table relationships.

## 1. Create the Database

Use `psql` (or your PostgreSQL admin tool):

```sql
CREATE DATABASE financial_tracker;
```

## 2. Open DBeaver and Create Connection

1. Open DBeaver.
2. Click **Database** -> **New Database Connection**.
3. Choose **PostgreSQL**.
4. Enter:
   - Host: `localhost`
   - Port: `5432`
   - Database: `financial_tracker`
   - Username: your postgres user
   - Password: your postgres password
5. Click **Test Connection**.
6. Click **Finish**.

## 3. Import `schema.sql`

1. In DBeaver, open SQL Editor for the `financial_tracker` database.
2. Open file: `backend/schema.sql`.
3. Run the script.
4. Refresh the database navigator.

## 4. Verify Tables

Confirm the following tables exist:

- `users`
- `categories`
- `transactions`
- `budgets`

## 5. Verify Foreign Keys

Confirm relationships:

- `categories.user_id` -> `users.id`
- `transactions.user_id` -> `users.id`
- `budgets.user_id` -> `users.id`
- `transactions.(category_id, user_id)` -> `categories.(id, user_id)`
- `budgets.(category_id, user_id)` -> `categories.(id, user_id)`

## 6. Integrity Checks

1. Insert a user.
2. Insert categories for that user.
3. Insert transactions and budgets tied to categories.
4. Try to attach another user's category to a transaction or budget.
   - Expected: foreign-key/ownership constraint prevents invalid cross-user link.

## 7. Optional Visual ERD

In DBeaver:

1. Right-click database schema.
2. Choose **ER Diagram**.
3. Confirm the 1:N relationships from users/categories to transactions and budgets.

