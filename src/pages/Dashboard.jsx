import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';

export default function Dashboard() {
  const { user } = useAuth();
  const { tasks } = useTasks();

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Xoş gəlmisiniz, {user?.name || 'İstifadəçi'} 👋</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card"><p className="text-sm text-slate-500">Ümumi</p><p className="text-2xl font-bold">{stats.total}</p></div>
        <div className="card"><p className="text-sm text-slate-500">Tamamlanan</p><p className="text-2xl font-bold text-green-600">{stats.completed}</p></div>
        <div className="card"><p className="text-sm text-slate-500">Gözləyən</p><p className="text-2xl font-bold text-yellow-600">{stats.pending}</p></div>
        <div className="card"><p className="text-sm text-slate-500">Davam edən</p><p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p></div>
      </div>
    </div>
  );
}
