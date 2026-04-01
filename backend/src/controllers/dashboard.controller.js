const dashboardService = require('../services/dashboard.service');
const asyncHandler = require('../utils/asyncHandler');

const getSummary = asyncHandler(async (req, res) => {
  const summary = await dashboardService.getSummary(req.user.id);

  res.json(summary);
});

module.exports = {
  getSummary,
};
