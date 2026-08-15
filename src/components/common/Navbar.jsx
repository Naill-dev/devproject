import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const linkClass = ({ isActive }) =>
  `px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
    isActive
      ? 'bg-white/15 text-white shadow-inner'
      : 'text-slate-300 hover:text-white hover:bg-white/10'
  }`;

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const avatar = user?.avatar || null;
  const initials = getInitials(user?.name);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/"
          className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent"
        >
          TaskSphere
        </Link>

        {isAuthenticated && (
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <NavLink to="/" end className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/tasks" className={linkClass}>
              Tapşırıqlar
            </NavLink>

            {/* Profil = yuvarlaq avatar */}
            <NavLink
              to="/profile"
              title={user?.name || 'Profil'}
              className={({ isActive }) =>
                `rounded-full p-0.5 transition-all ${
                  isActive
                    ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-950'
                    : 'hover:ring-2 hover:ring-white/30 hover:ring-offset-2 hover:ring-offset-slate-950'
                }`
              }
            >
              {avatar ? (
                <img
                  src={avatar}
                  alt={user?.name || 'Profil'}
                  className="w-9 h-9 rounded-full object-cover border border-white/20"
                />
              ) : (
                <span className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-xs font-bold flex items-center justify-center border border-white/20">
                  {initials}
                </span>
              )}
            </NavLink>

            <button
              type="button"
              onClick={handleLogout}
              className="btn-danger text-sm !py-1.5 !px-3"
            >
              Çıxış
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
