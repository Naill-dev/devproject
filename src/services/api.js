const STORAGE_KEY = 'tasksphere_tasks';
const AUTH_KEY = 'auth_token';

const initialTasks = [
  { id: '1', title: 'Auth modulunu tamamlamaq', category: 'Dev', status: 'pending', priority: 'high' },
  { id: '2', title: 'Global State qurmaq', category: 'Dev', status: 'in-progress', priority: 'high' },
  { id: '3', title: 'Error Boundary əlavə etmək', category: 'QA', status: 'completed', priority: 'medium' },
];

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

function getStored() {
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

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function assertAuth() {
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) {
    const err = new Error('Unauthorized');
    err.status = 401;
    throw err;
  }
  try {
    const payload = JSON.parse(atob(raw.split('.')[1] || ''));
    if (payload.exp && Date.now() >= payload.exp) {
      const err = new Error('Token expired');
      err.status = 401;
      throw err;
    }
  } catch (e) {
    if (e.status === 401) throw e;
  }
}

export const mockApi = {
  getTasks: async () => {
    await delay(350);
    assertAuth();
    return getStored();
  },
  createTask: async (taskData) => {
    await delay(450);
    assertAuth();
    const tasks = getStored();
    const newTask = { ...taskData, id: Date.now().toString() };
    tasks.push(newTask);
    saveTasks(tasks);
    return newTask;
  },
  updateTask: async (id, updatedFields) => {
    await delay(350);
    assertAuth();
    const tasks = getStored();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) throw new Error('Task tapılmadı');
    tasks[index] = { ...tasks[index], ...updatedFields };
    saveTasks(tasks);
    return tasks[index];
  },
  deleteTask: async (id) => {
    await delay(350);
    assertAuth();
    const tasks = getStored().filter((t) => t.id !== id);
    saveTasks(tasks);
    return { success: true, id };
  },
};
