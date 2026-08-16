import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

const AuthContext = createContext(null);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const EXPIRES_KEY = 'auth_expires';
const USERS_KEY = 'auth_users';
const SESSION_MS = 60 * 60 * 1000;

const DEMO_USER = {
  id: 'u1',
  name: 'Nail Mammadov',
  email: 'demo@tasksphere.com',
  password: 'Task2026!',
  role: 'Developer',
  avatar: null,
};

function createMockToken(email) {
  const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));
  const exp = Date.now() + SESSION_MS;
  const payload = btoa(JSON.stringify({ email, exp }));
  return `${header}.${payload}.mock`;
}

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      const seed = [DEMO_USER];
      localStorage.setItem(USERS_KEY, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw);
  } catch {
    return [DEMO_USER];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
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
    loadUsers();
    restoreSession();
    setLoading(false);

    const id = setInterval(() => {
      if (localStorage.getItem(TOKEN_KEY) && isExpired()) {
        clearSession();
      }
    }, 15_000);

    return () => clearInterval(id);
  }, [restoreSession, clearSession, isExpired]);

  const startSession = (userData) => {
    const exp = Date.now() + SESSION_MS;
    const mockToken = createMockToken(userData.email);
    const publicUser = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role || 'User',
      avatar: userData.avatar || null,
    };
    localStorage.setItem(TOKEN_KEY, mockToken);
    localStorage.setItem(USER_KEY, JSON.stringify(publicUser));
    localStorage.setItem(EXPIRES_KEY, String(exp));
    setToken(mockToken);
    setUser(publicUser);
  };

  const login = async (email, password) => {
    const users = loadUsers();
    const found = users.find(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        u.password === password
    );
    if (!found) {
      throw new Error('Email və ya şifrə yanlışdır!');
    }
    startSession(found);
    return { success: true };
  };

  const register = async ({ name, email, password }) => {
    const users = loadUsers();
    const exists = users.some(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (exists) {
      throw new Error('Bu email artıq qeydiyyatdan keçib');
    }
    const newUser = {
      id: `u-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: 'User',
      avatar: null,
    };
    users.push(newUser);
    saveUsers(users);
    startSession(newUser);
    return { success: true };
  };

  const logout = () => {
    clearSession();
  };

  const updateUser = (partial) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...partial };
      localStorage.setItem(USER_KEY, JSON.stringify(next));
      return next;
    });
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
        register,
        logout,
        updateUser,
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
