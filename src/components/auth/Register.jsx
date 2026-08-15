import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const err = {};
    if (!formData.name.trim()) err.name = 'Ad tələb olunur';
    if (!formData.email.includes('@')) err.email = 'Düzgün email daxil edin';
    if (formData.password.length < 6) err.password = 'Şifrə ən az 6 simvol olmalıdır';
    if (formData.password !== formData.confirmPassword) err.confirmPassword = 'Şifrələr uyğun gəlmir';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    // Demo: qeydiyyatdan sonra avtomatik login et
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch {
      alert('Qeydiyyat uğursuz oldu, lakin siz demo hesabla daxil ola bilərsiniz.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">Qeydiyyat</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Ad</label>
            <input type="text" className="input-field" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input type="email" className="input-field" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Şifrə</label>
            <input type="password" className="input-field" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Şifrə təkrar</label>
            <input type="password" className="input-field" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
          </div>
          <button type="submit" className="w-full btn-primary py-3 text-lg">Qeydiyyat</button>
        </form>
        <p className="text-center text-sm text-slate-500 mt-4">
          Hesabın var? <Link to="/login" className="text-indigo-600 hover:underline">Daxil ol</Link>
        </p>
      </div>
    </div>
  );
}
