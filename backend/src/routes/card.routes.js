const express = require('express');

const cardController = require('../controllers/card.controller');
const authenticate = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { hasLengthBetween, isPositiveInteger } = require('../utils/validators');

const router = express.Router();

router.use(authenticate);

router.get('/', cardController.getCards);
router.post(
  '/',
  validate({
    body: [
      {
        field: 'nickname',
        message: 'Card name must be between 1 and 60 characters.',
        validate: hasLengthBetween(1, 60),
      },
      {
        field: 'holder_name',
        message: 'Card holder must be between 2 and 120 characters.',
        validate: hasLengthBetween(2, 120),
      },
      {
        field: 'brand',
        message: 'Card brand must be between 2 and 40 characters.',
        validate: hasLengthBetween(2, 40),
      },
      {
        field: 'last4',
        message: 'Last 4 must contain exactly 4 digits.',
        validate: (value) => /^\d{4}$/.test(String(value)),
      },
      {
        field: 'expiry',
        message: 'Expiry must use MM/YY.',
        validate: (value) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(String(value)),
      },
      {
        field: 'theme',
        message: 'Theme must be indigo, emerald, or sunset.',
        validate: (value) => ['indigo', 'emerald', 'sunset'].includes(value),
        optional: true,
      },
    ],
  }),
  cardController.createCard
);
router.delete(
  '/:id',
  validate({
    params: [
      {
        field: 'id',
        message: 'Card id must be a positive integer.',
        validate: isPositiveInteger,
      },
    ],
  }),
  cardController.deleteCard
);

module.exports = router;
