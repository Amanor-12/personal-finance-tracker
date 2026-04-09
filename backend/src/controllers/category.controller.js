const categoryService = require('../services/category.service');
const asyncHandler = require('../utils/asyncHandler');

const getCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getCategories(req.user.id);

  res.json({
    categories,
  });
});

const getCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryById(req.user.id, req.params.id);

  res.json({
    category,
  });
});

const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.user.id, req.body);

  res.status(201).json({
    message: 'Category created successfully.',
    category,
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.user.id, req.params.id, req.body);

  res.json({
    message: 'Category updated successfully.',
    category,
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.user.id, req.params.id);

  res.json({
    message: 'Category deleted successfully.',
  });
});

module.exports = {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
};
