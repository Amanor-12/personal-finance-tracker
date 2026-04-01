const hasLengthBetween = (min, max) => {
  return (value) => typeof value === 'string' && value.trim().length >= min && value.trim().length <= max;
};

const isEmail = (value) => {
  if (typeof value !== 'string') {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
};

module.exports = {
  hasLengthBetween,
  isEmail,
  isCategoryType: (value) => ['income', 'expense'].includes(value),
  isMonth: (value) => Number.isInteger(Number(value)) && Number(value) >= 1 && Number(value) <= 12,
  isPositiveInteger: (value) => Number.isInteger(Number(value)) && Number(value) > 0,
  isPositiveNumber: (value) => !Number.isNaN(Number(value)) && Number(value) > 0,
  isTransactionType: (value) => ['income', 'expense'].includes(value),
  isValidDate: (value) => !Number.isNaN(Date.parse(value)),
  isYear: (value) => Number.isInteger(Number(value)) && Number(value) >= 2000 && Number(value) <= 2100,
};
