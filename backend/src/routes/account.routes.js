const express = require('express');

const accountController = require('../controllers/account.controller');
const authenticate = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const {
  hasLengthBetween,
  hasMaxLength,
  isAccountType,
  isCurrencyCode,
  isNonNegativeNumber,
  isPositiveInteger,
} = require('../utils/validators');

const router = express.Router();

const accountBodyRules = [
  {
    field: 'name',
    message: 'Account name must be between 2 and 80 characters.',
    validate: hasLengthBetween(2, 80),
  },
  {
    field: 'account_type',
    message: 'Account type is not supported.',
    validate: isAccountType,
  },
  {
    field: 'institution_name',
    message: 'Institution name must be 120 characters or fewer.',
    optional: true,
    validate: hasMaxLength(120),
  },
  {
    field: 'masked_identifier',
    message: 'Masked identifier must be 20 characters or fewer.',
    optional: true,
    validate: hasMaxLength(20),
  },
  {
    field: 'opening_balance',
    message: 'Opening balance must be zero or greater.',
    validate: isNonNegativeNumber,
  },
  {
    field: 'currency',
    message: 'Currency must be a three-letter code.',
    validate: isCurrencyCode,
  },
  {
    field: 'notes',
    message: 'Notes must be 255 characters or fewer.',
    optional: true,
    validate: hasMaxLength(255),
  },
];

const accountIdParam = [
  {
    field: 'id',
    message: 'Account id must be a positive integer.',
    validate: isPositiveInteger,
  },
];

router.use(authenticate);

router.get('/', accountController.getAccounts);

router.get(
  '/:id',
  validate({
    params: accountIdParam,
  }),
  accountController.getAccount
);

router.post(
  '/',
  validate({
    body: accountBodyRules,
  }),
  accountController.createAccount
);

router.put(
  '/:id',
  validate({
    body: accountBodyRules,
    params: accountIdParam,
  }),
  accountController.updateAccount
);

router.patch(
  '/:id/primary',
  validate({
    params: accountIdParam,
  }),
  accountController.setPrimaryAccount
);

router.delete(
  '/:id',
  validate({
    params: accountIdParam,
  }),
  accountController.archiveAccount
);

module.exports = router;
