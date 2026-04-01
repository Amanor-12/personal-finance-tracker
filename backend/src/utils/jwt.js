const jwt = require('jsonwebtoken');

const { jwtSecret } = require('../config/env');

const signToken = (user) => {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
    },
    jwtSecret,
    {
      expiresIn: '7d',
    }
  );
};

module.exports = {
  signToken,
};
