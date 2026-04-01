const budgetService = require('../services/budget.service');
const asyncHandler = require('../utils/asyncHandler');

const getBudgets = asyncHandler(async (req, res) => {
  const budgets = await budgetService.getBudgets(req.user.id);

  res.json({
    budgets,
  });
});

const createBudget = asyncHandler(async (req, res) => {
  const budget = await budgetService.createBudget(req.user.id, req.body);

  res.status(201).json({
    message: 'Budget created successfully.',
    budget,
  });
});

const updateBudget = asyncHandler(async (req, res) => {
  const budget = await budgetService.updateBudget(req.user.id, req.params.id, req.body);

  res.json({
    message: 'Budget updated successfully.',
    budget,
  });
});

const deleteBudget = asyncHandler(async (req, res) => {
  await budgetService.deleteBudget(req.user.id, req.params.id);

  res.json({
    message: 'Budget deleted successfully.',
  });
});

module.exports = {
  createBudget,
  deleteBudget,
  getBudgets,
  updateBudget,
};
