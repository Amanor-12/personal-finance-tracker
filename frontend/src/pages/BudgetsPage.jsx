import { useEffect, useMemo, useState } from 'react';

import AlertMessage from '../components/AlertMessage';
import BudgetForm from '../components/BudgetForm';
import BudgetList from '../components/BudgetList';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import { useAppData } from '../hooks/useAppData.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import budgetService from '../services/budgetService';
import categoryService from '../services/categoryService';
import { formatCurrency } from '../utils/currency';
import { extractErrorMessage, validateBudgetForm } from '../utils/validation';

const getInitialFormState = () => {
  const currentDate = new Date();

  return {
    category_id: '',
    amount_limit: '',
    month: String(currentDate.getMonth() + 1),
    year: String(currentDate.getFullYear()),
  };
};

const sortBudgets = (budgets) => {
  return [...budgets].sort((firstBudget, secondBudget) => {
    if (firstBudget.year !== secondBudget.year) {
      return secondBudget.year - firstBudget.year;
    }

    if (firstBudget.month !== secondBudget.month) {
      return secondBudget.month - firstBudget.month;
    }

    return firstBudget.category_name.localeCompare(secondBudget.category_name);
  });
};

export default function BudgetsPage() {
  const { refreshDashboard } = useAppData();
  const { token } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(getInitialFormState());
  const [editingBudget, setEditingBudget] = useState(null);
  const [alert, setAlert] = useState(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState(null);

  useEffect(() => {
    const loadBudgetsPage = async () => {
      setIsLoading(true);

      try {
        const [budgetsResponse, categoriesResponse] = await Promise.all([
          budgetService.getAll(token),
          categoryService.getAll(token),
        ]);

        setBudgets(sortBudgets(budgetsResponse.budgets));
        setCategories(categoriesResponse.categories.filter((category) => category.type === 'expense'));
      } catch (error) {
        setAlert({
          variant: 'error',
          title: 'Could not load budgets',
          message: extractErrorMessage(error),
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadBudgetsPage();
  }, [token]);

  const totals = useMemo(() => {
    return budgets.reduce(
      (result, budget) => {
        result.limit += budget.amount_limit;
        result.spent += budget.spent_amount;

        if (budget.utilization >= 1) {
          result.overBudget += 1;
        }

        return result;
      },
      { limit: 0, overBudget: 0, spent: 0 }
    );
  }, [budgets]);

  const resetForm = () => {
    setEditingBudget(null);
    setFormData(getInitialFormState());
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentValue) => ({
      ...currentValue,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationMessage = validateBudgetForm(formData);

    if (validationMessage) {
      setAlert({
        variant: 'error',
        title: 'Budget needs a quick fix',
        message: validationMessage,
      });
      return;
    }

    setIsSubmitting(true);

    const payload = {
      category_id: Number(formData.category_id),
      amount_limit: Number(formData.amount_limit),
      month: Number(formData.month),
      year: Number(formData.year),
    };

    try {
      if (editingBudget) {
        const response = await budgetService.update(token, editingBudget.id, payload);

        setBudgets((currentValue) =>
          sortBudgets(
            currentValue.map((budget) => (budget.id === editingBudget.id ? response.budget : budget))
          )
        );
        setAlert({
          variant: 'success',
          title: 'Budget updated',
          message: 'Monthly limit saved successfully.',
        });
      } else {
        const response = await budgetService.create(token, payload);
        setBudgets((currentValue) => sortBudgets([response.budget, ...currentValue]));
        setAlert({
          variant: 'success',
          title: 'Budget created',
          message: 'This category is now being tracked against a monthly limit.',
        });
      }

      refreshDashboard();
      resetForm();
    } catch (error) {
      setAlert({
        variant: 'error',
        title: 'Could not save budget',
        message: extractErrorMessage(error),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setFormData({
      category_id: String(budget.category_id),
      amount_limit: String(budget.amount_limit),
      month: String(budget.month),
      year: String(budget.year),
    });
  };

  const handleDelete = async () => {
    if (!budgetToDelete) {
      return;
    }

    setIsConfirmingDelete(true);

    try {
      await budgetService.remove(token, budgetToDelete.id);
      setBudgets((currentValue) => currentValue.filter((budget) => budget.id !== budgetToDelete.id));
      setAlert({
        variant: 'success',
        title: 'Budget deleted',
        message: 'The monthly limit was removed successfully.',
      });
      refreshDashboard();
      setBudgetToDelete(null);
      if (editingBudget?.id === budgetToDelete.id) {
        resetForm();
      }
    } catch (error) {
      setAlert({
        variant: 'error',
        title: 'Could not delete budget',
        message: extractErrorMessage(error),
      });
    } finally {
      setIsConfirmingDelete(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner label="Loading budgets..." />;
  }

  return (
    <div className="stack-xl">
      <PageHeader
        eyebrow="Budget management"
        description="Set category limits and monitor how current spending is tracking against them."
        title="Budgets"
      />

      <AlertMessage
        message={alert?.message}
        onDismiss={() => setAlert(null)}
        title={alert?.title}
        variant={alert?.variant}
      />

      <div className="stats-grid stats-grid--compact">
        <StatCard subtitle="Across all configured budgets" title="Total limit" value={formatCurrency(totals.limit)} />
        <StatCard subtitle="Live spending against limits" title="Tracked spend" value={formatCurrency(totals.spent)} />
        <StatCard subtitle="Budgets at or above 100%" title="Over budget" value={String(totals.overBudget)} />
      </div>

      <div className="workspace-grid">
        <BudgetForm
          categories={categories}
          formData={formData}
          isEditing={Boolean(editingBudget)}
          isSubmitting={isSubmitting}
          onCancel={resetForm}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />

        <BudgetList budgets={budgets} onDelete={setBudgetToDelete} onEdit={handleEdit} />
      </div>

      <ConfirmDialog
        confirmLabel="Delete budget"
        description="This will remove the budget only. Related transactions and categories will stay in place."
        isLoading={isConfirmingDelete}
        onCancel={() => setBudgetToDelete(null)}
        onConfirm={handleDelete}
        open={Boolean(budgetToDelete)}
        title={`Delete ${budgetToDelete?.category_name || 'this'} budget?`}
      />
    </div>
  );
}
