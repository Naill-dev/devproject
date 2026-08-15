const STORAGE_KEY = 'tasksphere_tasks';

const initialTasks = [
  { id: '1', title: 'Auth modulunu tamamlamaq', category: 'Dev', status: 'pending', priority: 'high' },
  { id: '2', title: 'Global State qurmaq', category: 'Dev', status: 'in-progress', priority: 'high' },
  { id: '3', title: 'Error Boundary əlavə etmək', category: 'QA', status: 'completed', priority: 'medium' }
];

const getStored = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTasks));
    return initialTasks;
  }
  return JSON.parse(data);
};

const saveTasks = (tasks) => localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  getTasks: async () => {
    await delay(400);
    return getStored();
  },
  createTask: async (taskData) => {
    await delay(500);
    const tasks = getStored();
    const newTask = { ...taskData, id: Date.now().toString() };
    tasks.push(newTask);
    saveTasks(tasks);
    return newTask;
  },
  updateTask: async (id, updatedFields) => {
    await delay(400);
    const tasks = getStored();
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task tapılmadı');
    tasks[index] = { ...tasks[index], ...updatedFields };
    saveTasks(tasks);
    return tasks[index];
  },
  deleteTask: async (id) => {
    await delay(400);
    const tasks = getStored().filter(t => t.id !== id);
    saveTasks(tasks);
    return { success: true, id };
  }
};
