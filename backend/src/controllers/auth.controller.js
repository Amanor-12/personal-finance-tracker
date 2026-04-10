const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');

const register = asyncHandler(async (req, res) => {
  const payload = await authService.registerUser(req.body);

  res.status(201).json({
    message: 'Account created successfully.',
    ...payload,
  });
});

const login = asyncHandler(async (req, res) => {
  const payload = await authService.loginUser(req.body);

  res.json({
    message: 'Welcome back.',
    ...payload,
  });
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.id);

  res.json({
    user,
  });
});

const listUsers = asyncHandler(async (req, res) => {
  const users = await authService.listUsers();

  res.json(users);
});

module.exports = {
  getCurrentUser,
  listUsers,
  register,
  login,
};
