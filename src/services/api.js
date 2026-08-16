const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const AUTH_KEY = 'auth_token';
const EXPIRES_KEY = 'auth_expires';

function assertAuth() {
  const token = localStorage.getItem(AUTH_KEY);
  const exp = Number(localStorage.getItem(EXPIRES_KEY) || 0);
  if (!token || !exp || Date.now() >= exp) {
    const err = new Error('Unauthorized');
    err.status = 401;
    throw err;
  }
}

async function request(path, options = {}) {
  assertAuth();

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (res.status === 401) {
    const err = new Error('Unauthorized');
    err.status = 401;
    throw err;
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed (${res.status})`);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const mockApi = {
  getTasks: () => request('/tasks'),

  createTask: (taskData) =>
    request('/tasks', {
      method: 'POST',
      body: JSON.stringify({
        dueDate: null,
        ...taskData,
      }),
    }),

  updateTask: (id, updatedFields) =>
    request(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updatedFields),
    }),

  deleteTask: async (id) => {
    await request(`/tasks/${id}`, { method: 'DELETE' });
    return { success: true, id };
  },
};
