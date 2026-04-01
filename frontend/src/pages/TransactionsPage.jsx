import { useEffect, useMemo, useState } from 'react';

import AlertMessage from '../components/AlertMessage';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import { useAppData } from '../hooks/useAppData.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import categoryService from '../services/categoryService';
import transactionService from '../services/transactionService';
import { formatCurrency } from '../utils/currency';
import { extractErrorMessage, validateTransactionForm } from '../utils/validation';

const getInitialFormState = () => ({
  amount: '',
  category_id: '',
  description: '',
  transaction_date: new Date().toISOString().split('T')[0],
  type: 'expense',
});

const sortTransactions = (transactions) => {
  return [...transactions].sort((firstTransaction, secondTransaction) => {
    const firstDate = new Date(firstTransaction.transaction_date).getTime();
    const secondDate = new Date(secondTransaction.transaction_date).getTime();

    if (firstDate !== secondDate) {
      return secondDate - firstDate;
    }

    return secondTransaction.id - firstTransaction.id;
  });
};

export default function TransactionsPage() {
  const { refreshDashboard } = useAppData();
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(getInitialFormState());
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [alert, setAlert] = useState(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  useEffect(() => {
    const loadTransactionsPage = async () => {
      setIsLoading(true);

      try {
        const [transactionsResponse, categoriesResponse] = await Promise.all([
          transactionService.getAll(token),
          categoryService.getAll(token),
        ]);

        setTransactions(sortTransactions(transactionsResponse.transactions));
        setCategories(categoriesResponse.categories);
      } catch (error) {
        setAlert({
          variant: 'error',
          title: 'Could not load transactions',
          message: extractErrorMessage(error),
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactionsPage();
  }, [token]);

  const totals = useMemo(() => {
    return transactions.reduce(
      (result, transaction) => {
        if (transaction.type === 'income') {
          result.income += transaction.amount;
        } else {
          result.expense += transaction.amount;
        }

        return result;
      },
      { expense: 0, income: 0 }
    );
  }, [transactions]);

  const resetForm = () => {
    setEditingTransaction(null);
    setFormData(getInitialFormState());
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentValue) => {
      const nextValue = {
        ...currentValue,
        [name]: value,
      };

      if (name === 'type') {
        const selectedCategory = categories.find((category) => String(category.id) === currentValue.category_id);

        if (selectedCategory && selectedCategory.type !== value) {
          nextValue.category_id = '';
        }
      }

      return nextValue;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationMessage = validateTransactionForm(formData);

    if (validationMessage) {
      setAlert({
        variant: 'error',
        title: 'Transaction needs a quick fix',
        message: validationMessage,
      });
      return;
    }

    setIsSubmitting(true);

    const payload = {
      amount: Number(formData.amount),
      category_id: Number(formData.category_id),
      description: formData.description.trim(),
      transaction_date: formData.transaction_date,
      type: formData.type,
    };

    try {
      if (editingTransaction) {
        const response = await transactionService.update(token, editingTransaction.id, payload);
        setTransactions((currentValue) =>
          sortTransactions(
            currentValue.map((transaction) =>
              transaction.id === editingTransaction.id ? response.transaction : transaction
            )
          )
        );
        setAlert({
          variant: 'success',
          title: 'Transaction updated',
          message: 'Your record was updated successfully.',
        });
      } else {
        const response = await transactionService.create(token, payload);
        setTransactions((currentValue) => sortTransactions([response.transaction, ...currentValue]));
        setAlert({
          variant: 'success',
          title: 'Transaction added',
          message: 'New money movement recorded successfully.',
        });
      }

      refreshDashboard();
      resetForm();
    } catch (error) {
      setAlert({
        variant: 'error',
        title: 'Could not save transaction',
        message: extractErrorMessage(error),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      amount: String(transaction.amount),
      category_id: String(transaction.category_id),
      description: transaction.description || '',
      transaction_date: transaction.transaction_date,
      type: transaction.type,
    });
  };

  const handleDelete = async () => {
    if (!transactionToDelete) {
      return;
    }

    setIsConfirmingDelete(true);

    try {
      await transactionService.remove(token, transactionToDelete.id);
      setTransactions((currentValue) =>
        currentValue.filter((transaction) => transaction.id !== transactionToDelete.id)
      );
      setAlert({
        variant: 'success',
        title: 'Transaction deleted',
        message: 'The entry was removed successfully.',
      });
      refreshDashboard();
      setTransactionToDelete(null);
      if (editingTransaction?.id === transactionToDelete.id) {
        resetForm();
      }
    } catch (error) {
      setAlert({
        variant: 'error',
        title: 'Could not delete transaction',
        message: extractErrorMessage(error),
      });
    } finally {
      setIsConfirmingDelete(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner label="Loading transactions..." />;
  }

  return (
    <div className="stack-xl">
      <PageHeader
        eyebrow="Money movement"
        description="Capture live financial activity with immediate updates to your dashboard and budgets."
        title="Transactions"
      />

      <AlertMessage
        message={alert?.message}
        onDismiss={() => setAlert(null)}
        title={alert?.title}
        variant={alert?.variant}
      />

      <div className="stats-grid stats-grid--compact">
        <StatCard subtitle="Recorded inflows" title="Income total" tone="positive" value={formatCurrency(totals.income)} />
        <StatCard subtitle="Recorded outflows" title="Expense total" tone="negative" value={formatCurrency(totals.expense)} />
        <StatCard subtitle="Current net activity" title="Net change" value={formatCurrency(totals.income - totals.expense)} />
      </div>

      <div className="workspace-grid">
        <TransactionForm
          categories={categories}
          formData={formData}
          isEditing={Boolean(editingTransaction)}
          isSubmitting={isSubmitting}
          onCancel={resetForm}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />

        <TransactionList onDelete={setTransactionToDelete} onEdit={handleEdit} transactions={transactions} />
      </div>

      <ConfirmDialog
        confirmLabel="Delete transaction"
        description="This action permanently removes the selected transaction from your records and dashboard summaries."
        isLoading={isConfirmingDelete}
        onCancel={() => setTransactionToDelete(null)}
        onConfirm={handleDelete}
        open={Boolean(transactionToDelete)}
        title={`Delete ${transactionToDelete?.description || transactionToDelete?.category_name || 'this'} transaction?`}
      />
    </div>
  );
}
