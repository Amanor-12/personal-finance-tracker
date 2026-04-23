const express = require('express');

const transactionController = require('../controllers/transaction.controller');
const authenticate = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const {
  hasMaxLength,
  hasLengthBetween,
  isBoolean,
  isPositiveInteger,
  isPositiveNumber,
  isTransactionType,
  isValidDate,
} = require('../utils/validators');

const router = express.Router();

router.use(authenticate);

router.get('/', transactionController.getTransactions);

router.get(
  '/:id',
  validate({
    params: [
      {
        field: 'id',
        message: 'Transaction id must be a positive integer.',
        validate: isPositiveInteger,
      },
    ],
  }),
  transactionController.getTransaction
);

router.post(
  '/',
  validate({
    body: [
      {
        field: 'category_id',
        message: 'A category is required.',
        validate: isPositiveInteger,
      },
      {
        field: 'type',
        message: 'Transaction type must be income or expense.',
        validate: isTransactionType,
      },
      {
        field: 'amount',
        message: 'Amount must be greater than zero.',
        validate: isPositiveNumber,
      },
      {
        field: 'account_id',
        message: 'Account id must be a positive integer.',
        validate: isPositiveInteger,
        optional: true,
      },
      {
        field: 'description',
        message: 'Description must be 255 characters or fewer.',
        validate: hasLengthBetween(1, 255),
        optional: true,
      },
      {
        field: 'notes',
        message: 'Notes must be 500 characters or fewer.',
        validate: hasMaxLength(500),
        optional: true,
      },
      {
        field: 'is_recurring',
        message: 'Recurring flag must be true or false.',
        validate: isBoolean,
        optional: true,
      },
      {
        field: 'transaction_date',
        message: 'Provide a valid transaction date.',
        validate: isValidDate,
      },
    ],
  }),
  transactionController.createTransaction
);

router.put(
  '/:id',
  validate({
    params: [
      {
        field: 'id',
        message: 'Transaction id must be a positive integer.',
        validate: isPositiveInteger,
      },
    ],
    body: [
      {
        field: 'category_id',
        message: 'A category is required.',
        validate: isPositiveInteger,
      },
      {
        field: 'type',
        message: 'Transaction type must be income or expense.',
        validate: isTransactionType,
      },
      {
        field: 'amount',
        message: 'Amount must be greater than zero.',
        validate: isPositiveNumber,
      },
      {
        field: 'account_id',
        message: 'Account id must be a positive integer.',
        validate: isPositiveInteger,
        optional: true,
      },
      {
        field: 'description',
        message: 'Description must be 255 characters or fewer.',
        validate: hasLengthBetween(1, 255),
        optional: true,
      },
      {
        field: 'notes',
        message: 'Notes must be 500 characters or fewer.',
        validate: hasMaxLength(500),
        optional: true,
      },
      {
        field: 'is_recurring',
        message: 'Recurring flag must be true or false.',
        validate: isBoolean,
        optional: true,
      },
      {
        field: 'transaction_date',
        message: 'Provide a valid transaction date.',
        validate: isValidDate,
      },
    ],
  }),
  transactionController.updateTransaction
);

router.delete(
  '/:id',
  validate({
    params: [
      {
        field: 'id',
        message: 'Transaction id must be a positive integer.',
        validate: isPositiveInteger,
      },
    ],
  }),
  transactionController.deleteTransaction
);

module.exports = router;
