const express = require('express');

const billingController = require('../controllers/billing.controller');
const authenticate = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { hasLengthBetween } = require('../utils/validators');

const router = express.Router();

router.use(authenticate);

router.get('/subscription', billingController.getSubscriptionOverview);

router.post(
  '/checkout',
  validate({
    body: [
      {
        field: 'plan_id',
        message: 'A paid plan is required to start checkout.',
        validate: hasLengthBetween(1, 80),
      },
      {
        field: 'return_url',
        message: 'A return URL is required.',
        validate: hasLengthBetween(1, 500),
      },
    ],
  }),
  billingController.createCheckoutSession
);

router.post('/portal', billingController.createPortalSession);

module.exports = router;
