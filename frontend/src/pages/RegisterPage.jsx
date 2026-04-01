import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AlertMessage from '../components/AlertMessage';
import AuthShell from '../components/AuthShell';
import { useAuth } from '../hooks/useAuth';
import { extractErrorMessage, validateAuthForm } from '../utils/validation';

const initialFormState = {
  email: '',
  name: '',
  password: '',
};

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormState);
  const [alert, setAlert] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentValue) => ({
      ...currentValue,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationMessage = validateAuthForm(formData, 'register');

    if (validationMessage) {
      setAlert({
        variant: 'error',
        title: 'Registration needs a quick fix',
        message: validationMessage,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await register(formData);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setAlert({
        variant: 'error',
        title: 'Could not create account',
        message: extractErrorMessage(error),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      description="Create a secure workspace with starter categories so you can begin tracking immediately."
      footerLabel="Sign in"
      footerLink="/login"
      footerPrompt="Already have an account?"
      title="Create your account"
    >
      <form className="form-grid" onSubmit={handleSubmit}>
        <AlertMessage
          message={alert?.message}
          onDismiss={() => setAlert(null)}
          title={alert?.title}
          variant={alert?.variant}
        />

        <label className="field">
          <span className="field__label">Full name</span>
          <input
            autoComplete="name"
            className="input-control"
            name="name"
            onChange={handleChange}
            placeholder="Jordan Lee"
            type="text"
            value={formData.name}
          />
        </label>

        <label className="field">
          <span className="field__label">Email</span>
          <input
            autoComplete="email"
            className="input-control"
            name="email"
            onChange={handleChange}
            placeholder="you@example.com"
            type="email"
            value={formData.email}
          />
        </label>

        <label className="field">
          <span className="field__label">Password</span>
          <input
            autoComplete="new-password"
            className="input-control"
            name="password"
            onChange={handleChange}
            placeholder="Minimum 8 characters"
            type="password"
            value={formData.password}
          />
        </label>

        <button className="button button--primary button--full" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </AuthShell>
  );
}
