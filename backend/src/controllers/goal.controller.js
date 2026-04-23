const goalService = require('../services/goal.service');
const asyncHandler = require('../utils/asyncHandler');

const getGoals = asyncHandler(async (req, res) => {
  const goals = await goalService.getGoals(req.user.id);

  res.json({
    goals,
  });
});

const getGoal = asyncHandler(async (req, res) => {
  const goal = await goalService.getGoalById(req.user.id, req.params.id);

  res.json({
    goal,
  });
});

const createGoal = asyncHandler(async (req, res) => {
  const goal = await goalService.createGoal(req.user.id, req.body);

  res.status(201).json({
    message: 'Goal created successfully.',
    goal,
  });
});

const updateGoal = asyncHandler(async (req, res) => {
  const goal = await goalService.updateGoal(req.user.id, req.params.id, req.body);

  res.json({
    message: 'Goal updated successfully.',
    goal,
  });
});

const deleteGoal = asyncHandler(async (req, res) => {
  await goalService.deleteGoal(req.user.id, req.params.id);

  res.json({
    message: 'Goal deleted successfully.',
  });
});

module.exports = {
  createGoal,
  deleteGoal,
  getGoal,
  getGoals,
  updateGoal,
};
