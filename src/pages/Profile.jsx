import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-3xl font-extrabold text-white">Profil</h1>
      <div className="card p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-indigo-500/30">
            {(user?.name || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xl font-semibold text-white">{user?.name}</p>
            <p className="text-slate-400 text-sm">{user?.role || 'İstifadəçi'}</p>
          </div>
        </div>
        <div className="space-y-2 pt-2 border-t border-white/10">
          <p className="text-sm text-slate-400">
            Email: <span className="text-slate-200">{user?.email}</span>
          </p>
        </div>
        <button type="button" onClick={logout} className="btn-danger mt-2">
          Çıxış et
        </button>
      </div>
    </div>
  );
}
