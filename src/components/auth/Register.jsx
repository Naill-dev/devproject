import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, isAuthenticated } = useAuth();

  // Declarative redirect
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Ad tələb olunur';
    if (!form.email.trim()) e.email = 'Email tələb olunur';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Email formatı yanlışdır';
    }
    if (!form.password || form.password.length < 6) {
      e.password = 'Minimum 6 simvol';
    }
    if (form.password !== form.confirmPassword) {
      e.confirmPassword = 'Şifrələr eyni deyil';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      // register tamamlandıqdan sonra isAuthenticated true olur və <Navigate /> avtomatik yönləndirir
    } catch (err) {
      setError(err.message || 'Qeydiyyat uğursuz oldu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md card p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-center text-indigo-300 mb-6">
          Qeydiyyat
        </h1>

        {error && (
          <p className="text-rose-300 text-sm mb-3 bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {[
            { key: 'name', label: 'Ad', type: 'text' },
            { key: 'email', label: 'Email', type: 'email' },
            { key: 'password', label: 'Şifrə', type: 'password' },
            { key: 'confirmPassword', label: 'Şifrə təkrar', type: 'password' },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-sm text-slate-300 mb-1">{f.label}</label>
              <input
                type={f.type}
                className="input-field"
                value={form[f.key]}
                onChange={(e) => setField(f.key, e.target.value)}
              />
              {errors[f.key] && (
                <p className="text-rose-400 text-sm mt-1">{errors[f.key]}</p>
              )}
            </div>
          ))}
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Yaradılır...' : 'Qeydiyyat'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-4">
          Hesabın var?{' '}
          <Link to="/login" className="text-indigo-300 hover:underline">
            Daxil ol
          </Link>
        </p>
      </div>
    </div>
  );
}
