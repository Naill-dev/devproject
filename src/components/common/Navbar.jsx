import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-indigo-700">TaskSphere</Link>
        {isAuthenticated && (
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-indigo-600">Dashboard</Link>
            <Link to="/tasks" className="hover:text-indigo-600">Tapşırıqlar</Link>
            <Link to="/profile" className="hover:text-indigo-600">Profil</Link>
            <button onClick={handleLogout} className="btn-danger text-sm">Çıxış</button>
          </div>
        )}
      </div>
    </nav>
  );
}
