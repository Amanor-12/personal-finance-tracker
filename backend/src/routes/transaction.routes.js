const express = require('express');

const transactionController = require('../controllers/transaction.controller');
const authenticate = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const {
  hasLengthBetween,
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
        field: 'description',
        message: 'Description must be 255 characters or fewer.',
        validate: hasLengthBetween(1, 255),
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
        field: 'description',
        message: 'Description must be 255 characters or fewer.',
        validate: hasLengthBetween(1, 255),
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
