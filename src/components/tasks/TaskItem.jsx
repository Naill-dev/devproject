import { useState } from 'react';
import { useTasks } from '../../context/TaskContext';

const priorityMeta = {
  high: { label: 'Yüksək', class: 'bg-rose-500/20 text-rose-300 ring-1 ring-rose-400/30' },
  medium: { label: 'Orta', class: 'bg-amber-500/20 text-amber-200 ring-1 ring-amber-400/30' },
  low: { label: 'Aşağı', class: 'bg-slate-500/20 text-slate-300 ring-1 ring-slate-400/30' },
};

export default function TaskItem({ task, dragging, onDragStart, onDragEnd }) {
  const { updateTask, deleteTask } = useTasks();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: task?.title || '',
    category: task?.category || '',
    priority: task?.priority || 'medium',
  });

  if (!task) return null;

  const p = priorityMeta[task.priority] || priorityMeta.medium;

  const startEdit = () => {
    setForm({
      title: task.title || '',
      category: task.category || '',
      priority: task.priority || 'medium',
    });
    setEditing(true);
  };

  const saveEdit = async () => {
    if (!form.title.trim()) return;
    await updateTask(task.id, {
      title: form.title.trim(),
      category: form.category.trim() || 'Ümumi',
      priority: form.priority,
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
        <div className="flex gap-2">
          <button type="button" onClick={saveEdit} className="btn-primary flex-1 text-sm">
            Saxla
          </button>
          <button type="button" onClick={() => setEditing(false)} className="btn-ghost text-sm">
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
            task.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-100'
          }`}
        >
          {task.title}
        </h3>
        <span className={`shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full ${p.class}`}>
          {p.label}
        </span>
      </div>

      {task.category && (
        <p className="text-xs text-slate-400 mb-3">#{task.category}</p>
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
        <span className="text-slate-600" title="Sürüklə">⋮⋮</span>
      </div>
    </article>
  );
}
