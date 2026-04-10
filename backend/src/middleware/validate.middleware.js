const buildErrors = (rules, values, req, location, errors) => {
  rules.forEach((rule) => {
    const originalValue = values[rule.field];
    const value = typeof originalValue === 'string' ? originalValue.trim() : originalValue;
    const isEmpty =
      value === undefined ||
      value === null ||
      (typeof value === 'string' && value.length === 0);

    if (isEmpty) {
      if (!rule.optional) {
        errors.push({
          field: rule.field,
          location,
          message: rule.message,
        });
      }
      return;
    }

    if (!rule.validate(value, req)) {
      errors.push({
        field: rule.field,
        location,
        message: rule.message,
      });
      return;
    }

    if (rule.sanitize) {
      values[rule.field] = rule.sanitize(value, req);
      return;
    }

    if (typeof originalValue === 'string') {
      values[rule.field] = value;
    }
  });
};

const validate = ({ body = [], params = [], query = [] }) => {
  return (req, res, next) => {
    const errors = [];

    buildErrors(body, req.body, req, 'body', errors);
    buildErrors(params, req.params, req, 'params', errors);
    buildErrors(query, req.query, req, 'query', errors);

    if (errors.length > 0) {
      return res.status(400).json({
        message: 'Please review the highlighted fields and try again.',
        error: 'Please review the highlighted fields and try again.',
        errors,
      });
    }

    return next();
  };
};

module.exports = validate;
