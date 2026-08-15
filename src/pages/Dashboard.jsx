import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';

export default function Dashboard() {
  const { user } = useAuth();
  const { tasks = [] } = useTasks();

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
  };

  const recent = [...tasks].slice(-5).reverse();

  return (
    <div className="space-y-8">
      <div className="card p-6 md:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-transparent to-violet-500/10 pointer-events-none" />
        <div className="relative">
          <p className="text-indigo-300 text-sm font-medium mb-1">Dashboard</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            Salam, {user?.name || 'İstifadəçi'} 👋
          </h1>
          <p className="text-slate-400 mt-2 max-w-xl">
            Tapşırıqlarını izlə, sürüklə-burax ilə status dəyiş və iş axınını sürətləndir.
          </p>
          <Link to="/tasks" className="btn-primary inline-flex mt-5">
            Tapşırıqlara keç →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Ümumi', value: stats.total, color: 'text-white' },
          { label: 'Gözləyən', value: stats.pending, color: 'text-amber-300' },
          { label: 'Davam edən', value: stats.inProgress, color: 'text-sky-300' },
          { label: 'Tamamlanan', value: stats.completed, color: 'text-emerald-300' },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <p className="text-xs uppercase tracking-wider text-slate-400">{s.label}</p>
            <p className={`text-3xl font-bold mt-2 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white">Son tapşırıqlar</h2>
          <Link to="/tasks" className="text-sm text-indigo-300 hover:text-indigo-200">
            Hamısı
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-slate-500 text-sm">Hələ tapşırıq yoxdur</p>
        ) : (
          <ul className="space-y-2">
            {recent.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/5"
              >
                <span className="text-slate-200 truncate">{t.title}</span>
                <span className="text-xs text-slate-400 shrink-0">{t.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
