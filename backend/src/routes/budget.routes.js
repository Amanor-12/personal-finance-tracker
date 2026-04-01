const express = require('express');

const budgetController = require('../controllers/budget.controller');
const authenticate = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { isMonth, isPositiveInteger, isPositiveNumber, isYear } = require('../utils/validators');

const router = express.Router();

router.use(authenticate);

router.get('/', budgetController.getBudgets);

router.post(
  '/',
  validate({
    body: [
      {
        field: 'category_id',
        message: 'Choose an expense category for this budget.',
        validate: isPositiveInteger,
      },
      {
        field: 'amount_limit',
        message: 'Budget limit must be greater than zero.',
        validate: isPositiveNumber,
      },
      {
        field: 'month',
        message: 'Month must be between 1 and 12.',
        validate: isMonth,
      },
      {
        field: 'year',
        message: 'Year must be between 2000 and 2100.',
        validate: isYear,
      },
    ],
  }),
  budgetController.createBudget
);

router.put(
  '/:id',
  validate({
    params: [
      {
        field: 'id',
        message: 'Budget id must be a positive integer.',
        validate: isPositiveInteger,
      },
    ],
    body: [
      {
        field: 'category_id',
        message: 'Choose an expense category for this budget.',
        validate: isPositiveInteger,
      },
      {
        field: 'amount_limit',
        message: 'Budget limit must be greater than zero.',
        validate: isPositiveNumber,
      },
      {
        field: 'month',
        message: 'Month must be between 1 and 12.',
        validate: isMonth,
      },
      {
        field: 'year',
        message: 'Year must be between 2000 and 2100.',
        validate: isYear,
      },
    ],
  }),
  budgetController.updateBudget
);

router.delete(
  '/:id',
  validate({
    params: [
      {
        field: 'id',
        message: 'Budget id must be a positive integer.',
        validate: isPositiveInteger,
      },
    ],
  }),
  budgetController.deleteBudget
);

module.exports = router;
