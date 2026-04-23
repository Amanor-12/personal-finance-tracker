const hasLengthBetween = (min, max) => {
  return (value) => typeof value === 'string' && value.trim().length >= min && value.trim().length <= max;
};

const hasMaxLength = (max) => {
  return (value) => typeof value === 'string' && value.trim().length <= max;
};

const isEmail = (value) => {
  if (typeof value !== 'string') {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
};

module.exports = {
  hasMaxLength,
  hasLengthBetween,
  isEmail,
  isAccountStatus: (value) => ['active', 'archived'].includes(value),
  isAccountType: (value) => ['checking', 'savings', 'credit_card', 'cash', 'investment', 'other'].includes(value),
  isCategoryType: (value) => ['income', 'expense'].includes(value),
  isCurrencyCode: (value) => typeof value === 'string' && /^[A-Z]{3}$/.test(value.trim()),
  isGoalType: (value) => ['save', 'payoff'].includes(value),
  isRecurringFrequency: (value) => ['weekly', 'biweekly', 'monthly', 'quarterly', 'annual', 'custom'].includes(value),
  isRecurringStatus: (value) => ['active', 'inactive'].includes(value),
  isBoolean: (value) => typeof value === 'boolean',
  isMonth: (value) => Number.isInteger(Number(value)) && Number(value) >= 1 && Number(value) <= 12,
  isNonNegativeNumber: (value) => !Number.isNaN(Number(value)) && Number(value) >= 0,
  isPositiveInteger: (value) => Number.isInteger(Number(value)) && Number(value) > 0,
  isPositiveNumber: (value) => !Number.isNaN(Number(value)) && Number(value) > 0,
  isTransactionType: (value) => ['income', 'expense'].includes(value),
  isValidDate: (value) => !Number.isNaN(Date.parse(value)),
  isYear: (value) => Number.isInteger(Number(value)) && Number(value) >= 2000 && Number(value) <= 2100,
};
