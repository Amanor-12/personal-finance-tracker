const accountService = require('../services/account.service');
const asyncHandler = require('../utils/asyncHandler');

const getAccounts = asyncHandler(async (req, res) => {
  const accounts = await accountService.getAccounts(req.user.id);

  res.json({
    accounts,
  });
});

const getAccount = asyncHandler(async (req, res) => {
  const account = await accountService.getAccountById(req.user.id, req.params.id);

  res.json({
    account,
  });
});

const createAccount = asyncHandler(async (req, res) => {
  const account = await accountService.createAccount(req.user.id, req.body);

  res.status(201).json({
    account,
    message: 'Account created successfully.',
  });
});

const updateAccount = asyncHandler(async (req, res) => {
  const account = await accountService.updateAccount(req.user.id, req.params.id, req.body);

  res.json({
    account,
    message: 'Account updated successfully.',
  });
});

const setPrimaryAccount = asyncHandler(async (req, res) => {
  const account = await accountService.setPrimaryAccount(req.user.id, req.params.id);

  res.json({
    account,
    message: 'Primary account updated successfully.',
  });
});

const archiveAccount = asyncHandler(async (req, res) => {
  await accountService.archiveAccount(req.user.id, req.params.id);

  res.json({
    message: 'Account archived successfully.',
  });
});

module.exports = {
  archiveAccount,
  createAccount,
  getAccount,
  getAccounts,
  setPrimaryAccount,
  updateAccount,
};
