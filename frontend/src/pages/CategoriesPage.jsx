import { useEffect, useMemo, useState } from 'react';

import AlertMessage from '../components/AlertMessage';
import CategoryForm from '../components/CategoryForm';
import CategoryList from '../components/CategoryList';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import { useAuth } from '../hooks/useAuth.jsx';
import categoryService from '../services/categoryService';
import { extractErrorMessage, validateCategoryForm } from '../utils/validation';

const initialFormState = {
  name: '',
  type: 'expense',
};

export default function CategoriesPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [editingCategory, setEditingCategory] = useState(null);
  const [alert, setAlert] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      setIsLoading(true);

      try {
        const response = await categoryService.getAll(token);
        setCategories(response.categories);
      } catch (error) {
        setAlert({
          variant: 'error',
          title: 'Could not load categories',
          message: extractErrorMessage(error),
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, [token]);

  const stats = useMemo(() => {
    return categories.reduce(
      (result, category) => {
        if (category.type === 'income') {
          result.income += 1;
        } else {
          result.expense += 1;
        }

        result.linkedTransactions += category.transaction_count;
        return result;
      },
      { expense: 0, income: 0, linkedTransactions: 0 }
    );
  }, [categories]);

  const resetForm = () => {
    setEditingCategory(null);
    setFormData(initialFormState);
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

    const validationMessage = validateCategoryForm(formData);

    if (validationMessage) {
      setAlert({
        variant: 'error',
        title: 'Category needs a quick fix',
        message: validationMessage,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingCategory) {
        const response = await categoryService.update(token, editingCategory.id, formData);
        setCategories((currentValue) =>
          currentValue.map((category) => (category.id === editingCategory.id ? response.category : category))
        );
        setAlert({
          variant: 'success',
          title: 'Category updated',
          message: 'Category changes saved successfully.',
        });
      } else {
        const response = await categoryService.create(token, formData);
        setCategories((currentValue) => [...currentValue, response.category]);
        setAlert({
          variant: 'success',
          title: 'Category added',
          message: 'New category created successfully.',
        });
      }

      resetForm();
    } catch (error) {
      setAlert({
        variant: 'error',
        title: 'Could not save category',
        message: extractErrorMessage(error),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      type: category.type,
    });
  };

  const handleDelete = async () => {
    if (!categoryToDelete) {
      return;
    }

    setIsConfirmingDelete(true);

    try {
      await categoryService.remove(token, categoryToDelete.id);
      setCategories((currentValue) => currentValue.filter((category) => category.id !== categoryToDelete.id));
      setAlert({
        variant: 'success',
        title: 'Category deleted',
        message: 'Category removed successfully.',
      });
      if (editingCategory?.id === categoryToDelete.id) {
        resetForm();
      }
      setCategoryToDelete(null);
    } catch (error) {
      setAlert({
        variant: 'error',
        title: 'Could not delete category',
        message: extractErrorMessage(error),
      });
    } finally {
      setIsConfirmingDelete(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner label="Loading categories..." />;
  }

  return (
    <div className="stack-xl">
      <PageHeader
        eyebrow="Category design"
        description="Keep your category structure clean so reporting, transaction entry, and budgets stay intuitive."
        title="Categories"
      />

      <AlertMessage
        message={alert?.message}
        onDismiss={() => setAlert(null)}
        title={alert?.title}
        variant={alert?.variant}
      />

      <div className="stats-grid stats-grid--compact">
        <StatCard subtitle="Income categories available" title="Income labels" value={String(stats.income)} />
        <StatCard subtitle="Expense categories available" title="Expense labels" value={String(stats.expense)} />
        <StatCard
          subtitle="Transactions linked across all categories"
          title="Linked records"
          value={String(stats.linkedTransactions)}
        />
      </div>

      <div className="workspace-grid">
        <CategoryForm
          formData={formData}
          isEditing={Boolean(editingCategory)}
          isSubmitting={isSubmitting}
          onCancel={resetForm}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />

        <CategoryList categories={categories} onDelete={setCategoryToDelete} onEdit={handleEdit} />
      </div>

      <ConfirmDialog
        confirmLabel="Delete category"
        description="If this category is linked to transactions or budgets, the API will block the deletion to protect your records."
        isLoading={isConfirmingDelete}
        onCancel={() => setCategoryToDelete(null)}
        onConfirm={handleDelete}
        open={Boolean(categoryToDelete)}
        title={`Delete ${categoryToDelete?.name || 'this'} category?`}
      />
    </div>
  );
}
