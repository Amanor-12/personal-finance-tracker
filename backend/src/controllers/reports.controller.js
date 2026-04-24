const reportsService = require('../services/reports.service');
const asyncHandler = require('../utils/asyncHandler');

const getOverview = asyncHandler(async (req, res) => {
  const reports = await reportsService.getReportsOverview(req.user.id, req.query);

  res.json({
    reports,
  });
});

module.exports = {
  getOverview,
};
