import { useState } from 'react';
import { useTasks } from '../../context/TaskContext';

const statusLabel = {
  pending: 'Gözləyən',
  'in-progress': 'Davam edən',
  completed: 'Tamamlanan',
};

const statusClass = {
  pending: 'bg-amber-100 text-amber-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  completed: 'bg-emerald-100 text-emerald-800',
};

const priorityLabel = {
  high: 'Yüksək',
  medium: 'Orta',
  low: 'Aşağı',
};

const priorityClass = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-slate-100 text-slate-600',
};

export default function TaskItem({ task }) {
  const { updateTask, deleteTask } = useTasks();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: task?.title || '',
    category: task?.category || '',
    status: task?.status || 'pending',
    priority: task?.priority || 'medium',
  });

  if (!task) return null;

  const startEdit = () => {
    setForm({
      title: task.title || '',
      category: task.category || '',
      status: task.status || 'pending',
      priority: task.priority || 'medium',
    });
    setEditing(true);
  };

  const saveEdit = async () => {
    if (!form.title.trim()) return;
    await updateTask(task.id, {
      title: form.title.trim(),
      category: form.category.trim() || 'Ümumi',
      status: form.status,
      priority: form.priority,
    });
    setEditing(false);
  };

  const cycleStatus = () => {
    const order = ['pending', 'in-progress', 'completed'];
    const idx = order.indexOf(task.status);
    const next = order[(idx + 1) % order.length];
    updateTask(task.id, { status: next });
  };

  const handleDelete = () => {
    if (window.confirm(`"${task.title}" silinsin?`)) {
      deleteTask(task.id);
    }
  };

  if (editing) {
    return (
      <div className="card space-y-3 border-2 border-indigo-200">
        <input
          className="input-field"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Başlıq"
        />
        <input
          className="input-field"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          placeholder="Kateqoriya"
        />
        <div className="grid grid-cols-2 gap-2">
          <select
            className="input-field"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="pending">Gözləyən</option>
            <option value="in-progress">Davam edən</option>
            <option value="completed">Tamamlanan</option>
          </select>
          <select
            className="input-field"
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
          >
            <option value="low">Aşağı</option>
            <option value="medium">Orta</option>
            <option value="high">Yüksək</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={saveEdit} className="btn-primary flex-1">
            Yadda saxla
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50"
          >
            Ləğv
          </button>
        </div>
      </div>
    );
  }

  return (
    <article className="card flex flex-col gap-3 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <h3
          className={`text-lg font-semibold leading-snug ${
            task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-800'
          }`}
        >
          {task.title}
        </h3>
        <span
          className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${
            priorityClass[task.priority] || priorityClass.medium
          }`}
        >
          {priorityLabel[task.priority] || task.priority}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
            statusClass[task.status] || statusClass.pending
          }`}
        >
          {statusLabel[task.status] || task.status}
        </span>
        {task.category && (
          <span className="text-slate-500 text-xs bg-slate-100 px-2.5 py-1 rounded-full">
            {task.category}
          </span>
        )}
      </div>

      <div className="mt-auto pt-2 flex flex-wrap gap-2 border-t border-slate-100">
        <button
          type="button"
          onClick={cycleStatus}
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
        >
          Status dəyiş
        </button>
        <button
          type="button"
          onClick={startEdit}
          className="text-sm text-slate-600 hover:text-slate-900 font-medium"
        >
          Redaktə
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="text-sm text-red-500 hover:text-red-700 font-medium ml-auto"
        >
          Sil
        </button>
      </div>
    </article>
  );
}
