import { useMemo, useState } from 'react';
import { useTasks } from '../context/TaskContext';
import TaskForm from '../components/tasks/TaskForm';
import TaskList from '../components/tasks/TaskList';

export default function Tasks() {
  const { tasks = [], loading } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tasks.filter((t) => {
      const matchSearch =
        !q ||
        (t.title || '').toLowerCase().includes(q) ||
        (t.category || '').toLowerCase().includes(q);
      const matchStatus = statusFilter === 'all' || t.status === statusFilter;
      const matchPriority = priorityFilter === 'all' || t.priority === priorityFilter;
      return matchSearch && matchStatus && matchPriority;
    });
  }, [tasks, search, statusFilter, priorityFilter]);

  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      {/* Başlıq */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Tapşırıqlar</h1>
          <p className="text-slate-500 text-sm mt-1">Bütün tapşırıqlarını idarə et</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="btn-primary"
        >
          {showForm ? 'Formu bağla' : '+ Yeni tapşırıq'}
        </button>
      </div>

      {/* Statistikalar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card !p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wide">Ümumi</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{stats.total}</p>
        </div>
        <div className="card !p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wide">Gözləyən</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{stats.pending}</p>
        </div>
        <div className="card !p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wide">Davam edən</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{stats.inProgress}</p>
        </div>
        <div className="card !p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wide">Tamamlanan</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.completed}</p>
        </div>
      </div>

      {/* Forma */}
      {showForm && (
        <TaskForm onClose={() => setShowForm(false)} />
      )}

      {/* Filterlər */}
      <div className="card !p-4">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Başlıq və ya kateqoriya axtar..."
            className="input-field max-w-sm"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field max-w-[180px]"
          >
            <option value="all">Bütün statuslar</option>
            <option value="pending">Gözləyən</option>
            <option value="in-progress">Davam edən</option>
            <option value="completed">Tamamlanan</option>
          </select>
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
            onClick={() => {
              setSearch('');
              setStatusFilter('all');
              setPriorityFilter('all');
            }}
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Sıfırla
          </button>
        </div>
      </div>

      {/* Siyahı */}
      <TaskList tasks={filtered} loading={loading} />
    </div>
  );
}
