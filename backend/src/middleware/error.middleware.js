const AppError = require('../utils/AppError');

const constraintMessages = {
  budgets_category_owner_fkey: 'The selected category is not available for this account.',
  budgets_user_category_period_key: 'A budget already exists for that category and period.',
  categories_user_name_type_key: 'A category with that name and type already exists.',
  transactions_category_owner_fkey: 'The selected category is not available for this account.',
  users_email_key: 'An account with that email already exists.',
};

const formatDatabaseError = (error) => {
  if (error.code === '23505') {
    return {
      message:
        constraintMessages[error.constraint] || 'A record with those details already exists.',
      statusCode: 409,
    };
  }

  if (error.code === '23503') {
    return {
      message:
        constraintMessages[error.constraint] ||
        'This action conflicts with an existing related record.',
      statusCode: 409,
    };
  }

  if (error.code === '23514' || error.code === '22P02') {
    return {
      message: 'One or more values were not in the expected format.',
      statusCode: 400,
    };
  }

  return null;
};

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      ...(error.details ? { details: error.details } : {}),
    });
  }

  const formattedDatabaseError = formatDatabaseError(error);

  if (formattedDatabaseError) {
    return res.status(formattedDatabaseError.statusCode).json({
      message: formattedDatabaseError.message,
    });
  }

  console.error(error);

  return res.status(500).json({
    message: 'Something went wrong. Please try again.',
  });
};

module.exports = errorHandler;
