const AppError = require('../utils/AppError');

const errorHandler = (error, req, res, next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      ...(error.details ? { details: error.details } : {}),
    });
  }

  if (error.code === '23505') {
    return res.status(409).json({
      message: 'A record with those details already exists.',
    });
  }

  if (error.code === '23503') {
    return res.status(409).json({
      message: 'This action conflicts with an existing related record.',
    });
  }

  if (error.code === '22P02') {
    return res.status(400).json({
      message: 'One or more values were not in the expected format.',
    });
  }

  console.error(error);

  return res.status(500).json({
    message: 'Something went wrong. Please try again.',
  });
};

module.exports = errorHandler;
