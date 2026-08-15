import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  if (isAuthenticated) {
    navigate(from, { replace: true });
  }

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = 'Email tələb olunur';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Email formatı yanlışdır';
    if (!password) e.password = 'Şifrə tələb olunur';
    else if (password.length < 6) e.password = 'Şifrə minimum 6 simvol';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Giriş uğursuz oldu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md card p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
          TaskSphere
        </h1>
        <p className="text-slate-400 mt-2">Daxil olun</p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm p-3">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="block text-sm text-slate-300 mb-1">Email</label>
          <input
            type="email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
          {errors.email && <p className="text-rose-400 text-sm mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm text-slate-300 mb-1">Şifrə</label>
          <input
            type="password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {errors.password && (
            <p className="text-rose-400 text-sm mt-1">{errors.password}</p>
          )}
        </div>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Daxil olunur...' : 'Daxil ol'}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-4">
        Hesabın yoxdur?{' '}
        <Link to="/register" className="text-indigo-300 hover:underline">
          Qeydiyyat
        </Link>
      </p>
    </div>
  );
}
