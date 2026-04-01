const express = require('express');

const categoryController = require('../controllers/category.controller');
const authenticate = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { hasLengthBetween, isCategoryType, isPositiveInteger } = require('../utils/validators');

const router = express.Router();

router.use(authenticate);

router.get('/', categoryController.getCategories);

router.post(
  '/',
  validate({
    body: [
      {
        field: 'name',
        message: 'Category name must be between 2 and 80 characters.',
        validate: hasLengthBetween(2, 80),
      },
      {
        field: 'type',
        message: 'Category type must be income or expense.',
        validate: isCategoryType,
      },
    ],
  }),
  categoryController.createCategory
);

router.put(
  '/:id',
  validate({
    params: [
      {
        field: 'id',
        message: 'Category id must be a positive integer.',
        validate: isPositiveInteger,
      },
    ],
    body: [
      {
        field: 'name',
        message: 'Category name must be between 2 and 80 characters.',
        validate: hasLengthBetween(2, 80),
      },
      {
        field: 'type',
        message: 'Category type must be income or expense.',
        validate: isCategoryType,
      },
    ],
  }),
  categoryController.updateCategory
);

router.delete(
  '/:id',
  validate({
    params: [
      {
        field: 'id',
        message: 'Category id must be a positive integer.',
        validate: isPositiveInteger,
      },
    ],
  }),
  categoryController.deleteCategory
);

module.exports = router;
