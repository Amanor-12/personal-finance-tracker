const transactionService = require('../services/transaction.service');
const asyncHandler = require('../utils/asyncHandler');

const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await transactionService.getTransactions(req.user.id);

  res.json({
    transactions,
  });
});

const getTransaction = asyncHandler(async (req, res) => {
  const transaction = await transactionService.getTransactionById(req.user.id, req.params.id);

  res.json({
    transaction,
  });
});

const createTransaction = asyncHandler(async (req, res) => {
  const transaction = await transactionService.createTransaction(req.user.id, req.body);

  res.status(201).json({
    message: 'Transaction created successfully.',
    transaction,
  });
});

const updateTransaction = asyncHandler(async (req, res) => {
  const transaction = await transactionService.updateTransaction(req.user.id, req.params.id, req.body);

  res.json({
    message: 'Transaction updated successfully.',
    transaction,
  });
});

const deleteTransaction = asyncHandler(async (req, res) => {
  await transactionService.deleteTransaction(req.user.id, req.params.id);

  res.json({
    message: 'Transaction deleted successfully.',
  });
});

module.exports = {
  createTransaction,
  deleteTransaction,
  getTransaction,
  getTransactions,
  updateTransaction,
};
