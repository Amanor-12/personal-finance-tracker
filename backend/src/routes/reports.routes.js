const express = require('express');

const reportsController = require('../controllers/reports.controller');
const authenticate = require('../middleware/auth.middleware');
const { requireBillingFeature } = require('../middleware/billing-access.middleware');
const validate = require('../middleware/validate.middleware');
const { isValidDate } = require('../utils/validators');

const router = express.Router();

router.use(authenticate);
router.use(requireBillingFeature('reports', 'advanced reporting'));

router.get(
  '/overview',
  validate({
    query: [
      {
        field: 'start_date',
        message: 'Start date must be a valid date.',
        optional: true,
        validate: isValidDate,
      },
      {
        field: 'end_date',
        message: 'End date must be a valid date.',
        optional: true,
        validate: isValidDate,
      },
    ],
  }),
  reportsController.getOverview
);

module.exports = router;
