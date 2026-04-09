# SQL Presentation Notes

Use this as a short script when presenting the backend database design.

## Database Structure

The schema uses four normalized tables:

- `users`
- `categories`
- `transactions`
- `budgets`

This avoids repeating user details or category names in every transaction row.

## Relationship Design

- `categories.user_id` links each category to exactly one user
- `transactions.user_id` links each transaction to one user
- `budgets.user_id` links each budget to one user
- Composite foreign keys on `transactions` and `budgets` reference `(category_id, user_id)` in `categories`

That composite key is important because it prevents one user from attaching their transaction or budget to another user's category.

## Normalization Talking Points

- User profile data exists only once in `users`
- Category names are stored once in `categories`
- Transactions reference categories by ID instead of duplicating category text everywhere
- Budgets also reference categories by ID instead of storing repeated category strings

This satisfies the rubric expectation that data should not be duplicated across tables unnecessarily.

## Constraint Examples

- `users.email` is unique so duplicate accounts cannot be created
- `categories_user_name_type_key` prevents duplicate category names of the same type for one user
- `budgets_user_category_period_key` prevents duplicate monthly budgets for the same category
- `CHECK` constraints validate transaction type, category type, budget month, budget year, and positive numeric values

These rules are enforced in the database, not only in application code.

## Integrity and Auditing

- All tables use `created_at` and `updated_at`
- A shared trigger automatically updates `updated_at` on every row change

This gives a consistent audit trail without repeating update logic in every query.

## Performance Notes

The schema includes indexes for common access patterns:

- categories by user and type
- transactions by user and date
- transactions by user and category
- budgets by user and period

These support the most common dashboard and CRUD queries.

## Demo Data

Presentation-friendly demo data is available in:

- `backend/demo_seed.sql`

That script creates a demo user, inserts categories, adds six months of transactions, and creates current-month budgets so the dashboard summary has meaningful results.

## Suggested Demo Sequence

1. Show the four tables and explain their roles
2. Point out the foreign keys and unique constraints
3. Run `demo_seed.sql`
4. Show the demo user and sample rows in each table
5. Explain how the backend API reads from these tables for CRUD and dashboard summary endpoints
