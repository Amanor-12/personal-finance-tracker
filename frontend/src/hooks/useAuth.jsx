import { createContext, useContext, useEffect, useState } from 'react';

import authService from '../services/authService';

const SESSION_STORAGE_KEY = 'flowledger.session';
const AuthContext = createContext(null);

const defaultSession = {
  user: null,
  token: '',
};

export function AuthProvider({ children }) {
  const [session, setSession] = useState(defaultSession);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const storedSession = window.localStorage.getItem(SESSION_STORAGE_KEY);

    if (!storedSession) {
      setIsInitializing(false);
      return;
    }

    try {
      const parsedSession = JSON.parse(storedSession);

      if (!parsedSession?.token) {
        window.localStorage.removeItem(SESSION_STORAGE_KEY);
        setIsInitializing(false);
        return;
      }

      authService
        .getCurrentUser(parsedSession.token)
        .then((data) => {
          setSession({
            token: parsedSession.token,
            user: data.user,
          });
        })
        .catch(() => {
          window.localStorage.removeItem(SESSION_STORAGE_KEY);
          setSession(defaultSession);
        })
        .finally(() => {
          setIsInitializing(false);
        });
    } catch (error) {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
      setIsInitializing(false);
    }
  }, []);

  const saveSession = (payload) => {
    const nextSession = {
      token: payload.token,
      user: payload.user,
    };

    setSession(nextSession);
    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextSession));
  };

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    saveSession(data);
    return data;
  };

  const register = async (payload) => {
    const data = await authService.register(payload);
    saveSession(data);
    return data;
  };

  const logout = () => {
    setSession(defaultSession);
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user: session.user,
        token: session.token,
        isAuthenticated: Boolean(session.token),
        isInitializing,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
}
