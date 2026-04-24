const express = require('express');

const goalController = require('../controllers/goal.controller');
const authenticate = require('../middleware/auth.middleware');
const { enforcePlanLimit } = require('../middleware/billing-access.middleware');
const validate = require('../middleware/validate.middleware');
const {
  hasLengthBetween,
  isGoalType,
  isNonNegativeNumber,
  isPositiveInteger,
  isPositiveNumber,
  isValidDate,
} = require('../utils/validators');

const router = express.Router();

router.use(authenticate);

router.get('/', goalController.getGoals);

router.get(
  '/:id',
  validate({
    params: [
      {
        field: 'id',
        message: 'Goal id must be a positive integer.',
        validate: isPositiveInteger,
      },
    ],
  }),
  goalController.getGoal
);

router.post(
  '/',
  enforcePlanLimit('goals'),
  validate({
    body: [
      {
        field: 'title',
        message: 'Goal title must be between 2 and 80 characters.',
        validate: hasLengthBetween(2, 80),
      },
      {
        field: 'goal_type',
        message: 'Goal type must be save or payoff.',
        validate: isGoalType,
      },
      {
        field: 'target_amount',
        message: 'Target amount must be greater than zero.',
        validate: isPositiveNumber,
      },
      {
        field: 'current_amount',
        message: 'Current amount must be zero or greater.',
        validate: isNonNegativeNumber,
      },
      {
        field: 'target_date',
        message: 'Target date must be a valid date.',
        optional: true,
        validate: isValidDate,
      },
    ],
  }),
  goalController.createGoal
);

router.put(
  '/:id',
  validate({
    params: [
      {
        field: 'id',
        message: 'Goal id must be a positive integer.',
        validate: isPositiveInteger,
      },
    ],
    body: [
      {
        field: 'title',
        message: 'Goal title must be between 2 and 80 characters.',
        validate: hasLengthBetween(2, 80),
      },
      {
        field: 'goal_type',
        message: 'Goal type must be save or payoff.',
        validate: isGoalType,
      },
      {
        field: 'target_amount',
        message: 'Target amount must be greater than zero.',
        validate: isPositiveNumber,
      },
      {
        field: 'current_amount',
        message: 'Current amount must be zero or greater.',
        validate: isNonNegativeNumber,
      },
      {
        field: 'target_date',
        message: 'Target date must be a valid date.',
        optional: true,
        validate: isValidDate,
      },
    ],
  }),
  goalController.updateGoal
);

router.delete(
  '/:id',
  validate({
    params: [
      {
        field: 'id',
        message: 'Goal id must be a positive integer.',
        validate: isPositiveInteger,
      },
    ],
  }),
  goalController.deleteGoal
);

module.exports = router;
