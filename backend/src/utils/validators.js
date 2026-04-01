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
  isPositiveInteger: (value) => Number.isInteger(Number(value)) && Number(value) > 0,
};
