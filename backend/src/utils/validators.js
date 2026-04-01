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
};
