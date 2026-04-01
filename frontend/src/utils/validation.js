const currentYear = new Date().getFullYear();

export function extractErrorMessage(error) {
  if (Array.isArray(error?.details) && error.details.length > 0) {
    return error.details[0].message;
  }

  return error?.message || 'Something went wrong. Please try again.';
}

export function validateAuthForm(values, mode) {
  if (mode === 'register' && (!values.name || values.name.trim().length < 2)) {
    return 'Enter your full name to continue.';
  }

  if (!values.email || !/\S+@\S+\.\S+/.test(values.email)) {
    return 'Enter a valid email address.';
  }

  if (!values.password || values.password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }

  return '';
}

export function validateCategoryForm(values) {
  if (!values.name || values.name.trim().length < 2) {
    return 'Category name must be at least 2 characters.';
  }

  if (!values.type) {
    return 'Choose whether this is an income or expense category.';
  }

  return '';
}

export function validateTransactionForm(values) {
  if (!values.type) {
    return 'Select whether this transaction is income or expense.';
  }

  if (!values.category_id) {
    return 'Choose a category for this transaction.';
  }

  if (!values.amount || Number(values.amount) <= 0) {
    return 'Amount must be greater than zero.';
  }

  if (!values.transaction_date) {
    return 'Choose the transaction date.';
  }

  return '';
}

export function validateBudgetForm(values) {
  if (!values.category_id) {
    return 'Choose an expense category for this budget.';
  }

  if (!values.amount_limit || Number(values.amount_limit) <= 0) {
    return 'Budget limit must be greater than zero.';
  }

  if (!values.month || Number(values.month) < 1 || Number(values.month) > 12) {
    return 'Select a valid month.';
  }

  if (!values.year || Number(values.year) < currentYear - 1 || Number(values.year) > currentYear + 5) {
    return 'Select a valid year.';
  }

  return '';
}
