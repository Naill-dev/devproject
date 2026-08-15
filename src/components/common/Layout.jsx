import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { useAuth } from '../../context/AuthContext';

export default function Layout() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen text-slate-100">
      {isAuthenticated && <Navbar />}
      <main
        className={`max-w-7xl mx-auto px-4 py-8 ${
          !isAuthenticated ? 'min-h-screen flex items-center justify-center' : ''
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}
