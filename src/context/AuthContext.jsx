import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('auth_token');
      const savedUser = localStorage.getItem('auth_user');
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error('LocalStorage parse error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    if (email === 'demo@tasksphere.com' && password === 'Task2026!') {
      const mockToken = 'mock-jwt-token-tasksphere';
      const userData = { id: 'u1', name: 'Nail Mammadov', email, role: 'Developer' };
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      setToken(mockToken);
      setUser(userData);
      return { success: true };
    }
    throw new Error('Email və ya şifrə yanlışdır! (Demo: demo@tasksphere.com / Task2026!)');
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated: !!token }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
