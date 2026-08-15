import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const linkClass = ({ isActive }) =>
  `px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
    isActive
      ? 'bg-white/15 text-white shadow-inner'
      : 'text-slate-300 hover:text-white hover:bg-white/10'
  }`;

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
          <div className="flex flex-wrap items-center gap-2">
            <NavLink to="/" end className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/tasks" className={linkClass}>
              Tapşırıqlar
            </NavLink>
            <NavLink to="/profile" className={linkClass}>
              Profil
            </NavLink>
            <span className="hidden sm:inline text-xs text-slate-400 px-2">
              {user?.name}
            </span>
            <button type="button" onClick={handleLogout} className="btn-danger text-sm !py-1.5 !px-3">
              Çıxış
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
