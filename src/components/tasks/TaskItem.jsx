import { useEffect, useState } from 'react';
import { useTasks } from '../../context/TaskContext';

const priorityMeta = {
  high: {
    label: 'Yüksək',
    class: 'bg-rose-500/20 text-rose-300 ring-1 ring-rose-400/30',
  },
  medium: {
    label: 'Orta',
    class: 'bg-amber-500/20 text-amber-200 ring-1 ring-amber-400/30',
  },
  low: {
    label: 'Aşağı',
    class: 'bg-slate-500/20 text-slate-300 ring-1 ring-slate-400/30',
  },
};

function useCountdown(dueDate) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!dueDate) return undefined;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [dueDate]);

  if (!dueDate) return null;

  const end = new Date(dueDate).getTime();
  if (Number.isNaN(end)) return null;

  const diff = end - now;
  if (diff <= 0) return { overdue: true, label: 'Gecikib' };

  const sec = Math.floor(diff / 1000);
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;

  const parts = [];
  if (d > 0) parts.push(`${d}g`);
  if (h > 0 || d > 0) parts.push(`${h}s`);
  parts.push(`${m}d`);
  parts.push(`${s}san`);

  return { overdue: false, label: parts.join(' ') };
}

export default function TaskItem({ task, dragging, onDragStart, onDragEnd }) {
  const { updateTask, deleteTask } = useTasks();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: task?.title || '',
    category: task?.category || '',
    priority: task?.priority || 'medium',
    dueDate: '',
  });

  const countdown = useCountdown(task?.dueDate);

  if (!task) return null;

  const p = priorityMeta[task.priority] || priorityMeta.medium;

  const startEdit = () => {
    let dueLocal = '';
    if (task.dueDate) {
      const d = new Date(task.dueDate);
      if (!Number.isNaN(d.getTime())) {
        const pad = (n) => String(n).padStart(2, '0');
        dueLocal = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
          d.getDate()
        )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      }
    }
    setForm({
      title: task.title || '',
      category: task.category || '',
      priority: task.priority || 'medium',
      dueDate: dueLocal,
    });
    setEditing(true);
  };

  const saveEdit = async () => {
    if (!form.title.trim()) return;
    await updateTask(task.id, {
      title: form.title.trim(),
      category: form.category.trim() || 'Ümumi',
      priority: form.priority,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
    });
    setEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm(`"${task.title}" silinsin?`)) deleteTask(task.id);
  };

  if (editing) {
    return (
      <div className="card p-4 space-y-3 border-indigo-400/40">
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
        <select
          className="input-field"
          value={form.priority}
          onChange={(e) => setForm({ ...form, priority: e.target.value })}
        >
          <option value="low">Aşağı</option>
          <option value="medium">Orta</option>
          <option value="high">Yüksək</option>
        </select>
        <div>
          <label className="block text-xs text-slate-400 mb-1">
            Deadline (istəyə bağlı)
          </label>
          <input
            type="datetime-local"
            className="input-field"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={saveEdit}
            className="btn-primary flex-1 text-sm"
          >
            Saxla
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="btn-ghost text-sm"
          >
            Ləğv
          </button>
        </div>
      </div>
    );
  }

  return (
    <article
      draggable
      onDragStart={(e) => onDragStart?.(e, task.id)}
      onDragEnd={onDragEnd}
      className={`card p-4 cursor-grab active:cursor-grabbing select-none
        hover:border-indigo-400/40 hover:-translate-y-0.5 hover:shadow-indigo-500/10
        ${dragging ? 'opacity-40 scale-95' : 'opacity-100'}
        transition-all duration-200`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3
          className={`font-semibold leading-snug ${
            task.status === 'completed'
              ? 'line-through text-slate-500'
              : 'text-slate-100'
          }`}
        >
          {task.title}
        </h3>
        <span
          className={`shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full ${p.class}`}
        >
          {p.label}
        </span>
      </div>

      {task.category && (
        <p className="text-xs text-slate-400 mb-2">#{task.category}</p>
      )}

      {task.status !== 'completed' && countdown && (
        <div
          className={`mb-3 text-xs font-semibold px-2.5 py-1 rounded-lg inline-flex items-center ${
            countdown.overdue
              ? 'bg-rose-500/20 text-rose-300 ring-1 ring-rose-400/40'
              : 'bg-indigo-500/15 text-indigo-200 ring-1 ring-indigo-400/30'
          }`}
        >
          {countdown.overdue ? '⚠ Gecikib' : `⏱ ${countdown.label}`}
        </div>
      )}

      <div className="flex items-center gap-3 text-xs pt-2 border-t border-white/5">
        <button
          type="button"
          onClick={startEdit}
          className="text-indigo-300 hover:text-indigo-200 font-medium"
        >
          Redaktə
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="text-rose-400 hover:text-rose-300 font-medium ml-auto"
        >
          Sil
        </button>
        <span className="text-slate-600" title="Sürüklə">
          ⋮⋮
        </span>
      </div>
    </article>
  );
}
