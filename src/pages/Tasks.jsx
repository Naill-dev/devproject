import { useMemo, useState } from 'react';
import { useTasks } from '../context/TaskContext';
import TaskForm from '../components/tasks/TaskForm';
import TaskItem from '../components/tasks/TaskItem';

const COLUMNS = [
  {
    id: 'pending',
    title: 'Gözləyən',
    accent: 'from-amber-400/30 to-orange-500/10',
    ring: 'ring-amber-400/40',
    badge: 'bg-amber-400/20 text-amber-200',
  },
  {
    id: 'in-progress',
    title: 'Davam edən',
    accent: 'from-sky-400/30 to-blue-600/10',
    ring: 'ring-sky-400/40',
    badge: 'bg-sky-400/20 text-sky-200',
  },
  {
    id: 'completed',
    title: 'Tamamlanan',
    accent: 'from-emerald-400/30 to-teal-600/10',
    ring: 'ring-emerald-400/40',
    badge: 'bg-emerald-400/20 text-emerald-200',
  },
];

export default function Tasks() {
  const { tasks = [], loading, error, updateTask } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [dragId, setDragId] = useState(null);
  const [overCol, setOverCol] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tasks.filter((t) => {
      const matchSearch =
        !q ||
        (t.title || '').toLowerCase().includes(q) ||
        (t.category || '').toLowerCase().includes(q);
      const matchPriority = priorityFilter === 'all' || t.priority === priorityFilter;
      return matchSearch && matchPriority;
    });
  }, [tasks, search, priorityFilter]);

  const byStatus = (status) => filtered.filter((t) => t.status === status);

  const onDragStart = (e, id) => {
    setDragId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragEnd = () => {
    setDragId(null);
    setOverCol(null);
  };

  const onDragOver = (e, colId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setOverCol(colId);
  };

  const onDrop = async (e, status) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || dragId;
    setDragId(null);
    setOverCol(null);
    if (!id) return;
    const task = tasks.find((t) => t.id === id);
    if (!task || task.status === status) return;
    await updateTask(id, { status });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-200 to-violet-300 bg-clip-text text-transparent">
            Tapşırıqlar
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Kartı sürükləyib başqa sütuna at — status avtomatik dəyişir
          </p>
        </div>
        <button type="button" onClick={() => setShowForm((v) => !v)} className="btn-primary">
          {showForm ? 'Formu bağla' : '+ Yeni tapşırıq'}
        </button>
      </div>

      {showForm && <TaskForm onClose={() => setShowForm(false)} />}

      <div className="glass-panel p-4 flex flex-wrap gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Axtar..."
          className="input-field max-w-xs"
        />
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="input-field max-w-[180px]"
        >
          <option value="all">Bütün prioritetlər</option>
          <option value="high">Yüksək</option>
          <option value="medium">Orta</option>
          <option value="low">Aşağı</option>
        </select>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => {
            setSearch('');
            setPriorityFilter('all');
          }}
        >
          Sıfırla
        </button>
      </div>

      {loading && (
        <div className="card p-10 text-center text-slate-400">Yüklənir...</div>
      )}
      {error && (
        <div className="card p-10 text-center text-rose-400">Xəta: {error}</div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
          {COLUMNS.map((col) => {
            const items = byStatus(col.id);
            const isOver = overCol === col.id;
            return (
              <section
                key={col.id}
                onDragOver={(e) => onDragOver(e, col.id)}
                onDragLeave={() => setOverCol(null)}
                onDrop={(e) => onDrop(e, col.id)}
                className={`glass-panel min-h-[420px] p-4 transition-all duration-200 ${
                  isOver ? `ring-2 ${col.ring} scale-[1.01]` : ''
                }`}
              >
                <div
                  className={`rounded-xl mb-4 px-3 py-2 bg-gradient-to-r ${col.accent} flex items-center justify-between`}
                >
                  <h2 className="font-semibold text-white">{col.title}</h2>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${col.badge}`}>
                    {items.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {items.length === 0 && (
                    <p className="text-center text-slate-500 text-sm py-10 border border-dashed border-white/10 rounded-xl">
                      Bura kart at
                    </p>
                  )}
                  {items.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      dragging={dragId === task.id}
                      onDragStart={onDragStart}
                      onDragEnd={onDragEnd}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
