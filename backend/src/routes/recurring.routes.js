const express = require('express');

const recurringController = require('../controllers/recurring.controller');
const authenticate = require('../middleware/auth.middleware');
const { requireBillingFeature } = require('../middleware/billing-access.middleware');
const validate = require('../middleware/validate.middleware');
const {
  hasLengthBetween,
  hasMaxLength,
  isPositiveInteger,
  isPositiveNumber,
  isRecurringFrequency,
  isRecurringStatus,
  isValidDate,
} = require('../utils/validators');

const router = express.Router();

router.use(authenticate);
router.use(requireBillingFeature('recurringPayments', 'recurring payments'));

const recurringBodyValidation = [
  {
    field: 'name',
    message: 'Recurring payment name must be between 2 and 120 characters.',
    validate: hasLengthBetween(2, 120),
  },
  {
    field: 'category_id',
    message: 'Choose an expense category.',
    validate: isPositiveInteger,
  },
  {
    field: 'account_id',
    message: 'Account id must be a positive integer.',
    optional: true,
    validate: isPositiveInteger,
  },
  {
    field: 'amount',
    message: 'Amount must be greater than zero.',
    validate: isPositiveNumber,
  },
  {
    field: 'billing_frequency',
    message: 'Billing frequency is invalid.',
    validate: isRecurringFrequency,
  },
  {
    field: 'next_payment_date',
    message: 'Next payment date must be a valid date.',
    validate: isValidDate,
  },
  {
    field: 'notes',
    message: 'Notes must be 500 characters or fewer.',
    optional: true,
    validate: hasMaxLength(500),
  },
  {
    field: 'status',
    message: 'Status must be active or inactive.',
    validate: isRecurringStatus,
  },
];

router.get('/', recurringController.getRecurringPayments);

router.get(
  '/:id',
  validate({
    params: [
      {
        field: 'id',
        message: 'Recurring payment id must be a positive integer.',
        validate: isPositiveInteger,
      },
    ],
  }),
  recurringController.getRecurringPayment
);

router.post(
  '/',
  validate({
    body: recurringBodyValidation,
  }),
  recurringController.createRecurringPayment
);

router.put(
  '/:id',
  validate({
    body: recurringBodyValidation,
    params: [
      {
        field: 'id',
        message: 'Recurring payment id must be a positive integer.',
        validate: isPositiveInteger,
      },
    ],
  }),
  recurringController.updateRecurringPayment
);

router.delete(
  '/:id',
  validate({
    params: [
      {
        field: 'id',
        message: 'Recurring payment id must be a positive integer.',
        validate: isPositiveInteger,
      },
    ],
  }),
  recurringController.deleteRecurringPayment
);

module.exports = router;
