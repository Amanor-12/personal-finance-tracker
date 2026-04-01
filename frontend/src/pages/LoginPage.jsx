import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import AlertMessage from '../components/AlertMessage';
import AuthShell from '../components/AuthShell';
import { useAuth } from '../hooks/useAuth.jsx';
import { extractErrorMessage, validateAuthForm } from '../utils/validation';

const initialFormState = {
  email: '',
  password: '',
};

export default function LoginPage() {
  const { login } = useAuth();
  const location = useLocation();
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

  const handleUseDemo = () => {
    setFormData({
      email: 'demo@flowledger.com',
      password: 'DemoPass123!',
    });
    setAlert(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationMessage = validateAuthForm(formData, 'login');

    if (validationMessage) {
      setAlert({
        variant: 'error',
        title: 'Login needs a quick fix',
        message: validationMessage,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await login(formData);
      const nextPath = location.state?.from?.pathname || '/dashboard';
      navigate(nextPath, { replace: true });
    } catch (error) {
      setAlert({
        variant: 'error',
        title: 'Could not sign in',
        message: extractErrorMessage(error),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      description="Sign in to manage your budgets, categories, transactions, and dashboard."
      footerLabel="Create an account"
      footerLink="/register"
      footerPrompt="Need a workspace?"
      title="Sign in"
    >
      <form className="form-grid" onSubmit={handleSubmit}>
        <AlertMessage
          message={alert?.message}
          onDismiss={() => setAlert(null)}
          title={alert?.title}
          variant={alert?.variant}
        />

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
            autoComplete="current-password"
            className="input-control"
            name="password"
            onChange={handleChange}
            placeholder="Enter your password"
            type="password"
            value={formData.password}
          />
        </label>

        <button className="button button--primary button--full" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>

        <div className="demo-card">
          <div>
            <span className="demo-card__label">Demo workspace</span>
            <strong>demo@flowledger.com</strong>
            <p>Password: DemoPass123!</p>
          </div>
          <button className="button button--ghost" onClick={handleUseDemo} type="button">
            Use demo account
          </button>
        </div>
      </form>

      <div className="auth-card__aside">
        <span>Need your own workspace instead?</span>
        <Link to="/register">Register here</Link>
      </div>
    </AuthShell>
  );
}
