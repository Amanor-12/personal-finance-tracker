const express = require('express');

const authController = require('../controllers/auth.controller');
const authenticate = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { hasLengthBetween, isEmail } = require('../utils/validators');

const router = express.Router();

router.post(
  '/',
  validate({
    body: [
      {
        field: 'name',
        message: 'Name must be between 2 and 120 characters.',
        validate: hasLengthBetween(2, 120),
      },
      {
        field: 'email',
        message: 'Enter a valid email address.',
        validate: isEmail,
        sanitize: (value) => value.toLowerCase(),
      },
      {
        field: 'password',
        message: 'Password must be between 8 and 72 characters.',
        validate: hasLengthBetween(8, 72),
      },
    ],
  }),
  authController.register
);

router.post(
  '/register',
  validate({
    body: [
      {
        field: 'name',
        message: 'Name must be between 2 and 120 characters.',
        validate: hasLengthBetween(2, 120),
      },
      {
        field: 'email',
        message: 'Enter a valid email address.',
        validate: isEmail,
        sanitize: (value) => value.toLowerCase(),
      },
      {
        field: 'password',
        message: 'Password must be between 8 and 72 characters.',
        validate: hasLengthBetween(8, 72),
      },
    ],
  }),
  authController.register
);

router.post(
  '/login',
  validate({
    body: [
      {
        field: 'email',
        message: 'Enter a valid email address.',
        validate: isEmail,
        sanitize: (value) => value.toLowerCase(),
      },
      {
        field: 'password',
        message: 'Password is required.',
        validate: hasLengthBetween(1, 72),
      },
    ],
  }),
  authController.login
);

router.get('/me', authenticate, authController.getCurrentUser);
router.get('/', authenticate, authController.listUsers);

module.exports = router;
