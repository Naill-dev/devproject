import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const EXPIRES_KEY = 'auth_expires';
const SESSION_MS = 60 * 60 * 1000;

function createMockToken(email) {
  const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));
  const exp = Date.now() + SESSION_MS;
  const payload = btoa(JSON.stringify({ email, exp }));
  return `${header}.${payload}.mock`;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(EXPIRES_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const isExpired = useCallback(() => {
    const exp = Number(localStorage.getItem(EXPIRES_KEY) || 0);
    return !exp || Date.now() >= exp;
  }, []);

  const restoreSession = useCallback(() => {
    try {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      const savedUser = localStorage.getItem(USER_KEY);
      if (!savedToken || !savedUser) {
        clearSession();
        return;
      }
      if (isExpired()) {
        clearSession();
        return;
      }
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    } catch {
      clearSession();
    }
  }, [clearSession, isExpired]);

  useEffect(() => {
    restoreSession();
    setLoading(false);

    const id = setInterval(() => {
      if (localStorage.getItem(TOKEN_KEY) && isExpired()) {
        clearSession();
      }
    }, 15_000);

    return () => clearInterval(id);
  }, [restoreSession, clearSession, isExpired]);

  const login = async (email, password) => {
    if (email === 'demo@tasksphere.com' && password === 'Task2026!') {
      const exp = Date.now() + SESSION_MS;
      const mockToken = createMockToken(email);
      const userData = {
        id: 'u1',
        name: 'Nail Mammadov',
        email,
        role: 'Developer',
      };
      localStorage.setItem(TOKEN_KEY, mockToken);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      localStorage.setItem(EXPIRES_KEY, String(exp));
      setToken(mockToken);
      setUser(userData);
      return { success: true };
    }
    throw new Error('Email və ya şifrə yanlışdır!');
  };

  const logout = () => {
    clearSession();
  };

  const handleUnauthorized = useCallback(() => {
    clearSession();
  }, [clearSession]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        handleUnauthorized,
        isAuthenticated: !!token && !isExpired(),
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
