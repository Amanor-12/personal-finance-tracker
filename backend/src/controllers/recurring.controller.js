const recurringService = require('../services/recurring.service');
const asyncHandler = require('../utils/asyncHandler');

const getRecurringPayments = asyncHandler(async (req, res) => {
  const recurringPayments = await recurringService.getRecurringPayments(req.user.id);

  res.json({
    recurringPayments,
  });
});

const getRecurringPayment = asyncHandler(async (req, res) => {
  const recurringPayment = await recurringService.getRecurringPaymentById(req.user.id, req.params.id);

  res.json({
    recurringPayment,
  });
});

const createRecurringPayment = asyncHandler(async (req, res) => {
  const recurringPayment = await recurringService.createRecurringPayment(req.user.id, req.body);

  res.status(201).json({
    message: 'Recurring payment created successfully.',
    recurringPayment,
  });
});

const updateRecurringPayment = asyncHandler(async (req, res) => {
  const recurringPayment = await recurringService.updateRecurringPayment(req.user.id, req.params.id, req.body);

  res.json({
    message: 'Recurring payment updated successfully.',
    recurringPayment,
  });
});

const deleteRecurringPayment = asyncHandler(async (req, res) => {
  await recurringService.deleteRecurringPayment(req.user.id, req.params.id);

  res.json({
    message: 'Recurring payment deleted successfully.',
  });
});

module.exports = {
  createRecurringPayment,
  deleteRecurringPayment,
  getRecurringPayment,
  getRecurringPayments,
  updateRecurringPayment,
};
