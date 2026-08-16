const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const AUTH_KEY = 'auth_token';
const EXPIRES_KEY = 'auth_expires';
const STORAGE_KEY = 'tasksphere_tasks';

const initialTasks = [
  {
    id: '1',
    title: 'Auth modulunu tamamlamaq',
    category: 'Dev',
    status: 'pending',
    priority: 'high',
    dueDate: null,
  },
  {
    id: '2',
    title: 'Global State qurmaq',
    category: 'Dev',
    status: 'in-progress',
    priority: 'high',
    dueDate: null,
  },
  {
    id: '3',
    title: 'Error Boundary əlavə etmək',
    category: 'QA',
    status: 'completed',
    priority: 'medium',
    dueDate: null,
  },
];

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

function assertAuth() {
  const token = localStorage.getItem(AUTH_KEY);
  const exp = Number(localStorage.getItem(EXPIRES_KEY) || 0);
  if (!token || !exp || Date.now() >= exp) {
    const err = new Error('Unauthorized');
    err.status = 401;
    throw err;
  }
}

function getLocal() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTasks));
      return [...initialTasks];
    }
    return JSON.parse(data);
  } catch {
    return [...initialTasks];
  }
}

function saveLocal(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function shouldTryHttp() {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1';
}

async function httpRequest(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

const localApi = {
  async getTasks() {
    await delay();
    return getLocal();
  },
  async createTask(taskData) {
    await delay();
    const tasks = getLocal();
    const newTask = {
      dueDate: null,
      ...taskData,
      id: Date.now().toString(),
    };
    tasks.push(newTask);
    saveLocal(tasks);
    return newTask;
  },
  async updateTask(id, updatedFields) {
    await delay();
    const tasks = getLocal();
    const index = tasks.findIndex((t) => String(t.id) === String(id));
    if (index === -1) throw new Error('Task tapılmadı');
    tasks[index] = { ...tasks[index], ...updatedFields };
    saveLocal(tasks);
    return tasks[index];
  },
  async deleteTask(id) {
    await delay();
    saveLocal(getLocal().filter((t) => String(t.id) !== String(id)));
    return { success: true, id };
  },
};

async function run(httpFn, localFn) {
  assertAuth();

  if (!shouldTryHttp()) {
    return localFn();
  }

  try {
    return await httpFn();
  } catch {
    return localFn();
  }
}

export const mockApi = {
  getTasks: () =>
    run(
      () => httpRequest('/tasks'),
      () => localApi.getTasks()
    ),

  createTask: (taskData) =>
    run(
      () =>
        httpRequest('/tasks', {
          method: 'POST',
          body: JSON.stringify({ dueDate: null, ...taskData }),
        }),
      () => localApi.createTask(taskData)
    ),

  updateTask: (id, data) =>
    run(
      () =>
        httpRequest(`/tasks/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(data),
        }),
      () => localApi.updateTask(id, data)
    ),

  deleteTask: (id) =>
    run(
      async () => {
        await httpRequest(`/tasks/${id}`, { method: 'DELETE' });
        return { success: true, id };
      },
      () => localApi.deleteTask(id)
    ),
};
