const jwt = require('jsonwebtoken');

const { jwtSecret } = require('../config/env');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Authentication is required to access this resource.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, jwtSecret);
    req.user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
    };

    return next();
  } catch (error) {
    return res.status(401).json({
      message: 'Your session is invalid or has expired. Please sign in again.',
    });
  }
};

module.exports = authenticate;
