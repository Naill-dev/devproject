import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';

export default function TaskForm({ onClose }) {
  const { addTask } = useTasks();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    status: 'pending',
    priority: 'medium'
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const err = {};
    if (!formData.title.trim()) err.title = 'Başlıq tələb olunur';
    if (!formData.category.trim()) err.category = 'Kateqoriya tələb olunur';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await addTask(formData);
    setFormData({ title: '', category: '', status: 'pending', priority: 'medium' });
    onClose?.();
  };

  return (
    <div className="card mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Başlıq *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-field"
              placeholder="Tapşırıq başlığı"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Kateqoriya *</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="input-field"
              placeholder="Məsələn: Dev, QA, Design"
            />
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="input-field"
            >
              <option value="pending">Gözləyən</option>
              <option value="in-progress">Davam edən</option>
              <option value="completed">Tamamlanan</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Prioritet</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="input-field"
            >
              <option value="low">Aşağı</option>
              <option value="medium">Orta</option>
              <option value="high">Yüksək</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn-primary">Əlavə et</button>
          {onClose && <button type="button" onClick={onClose} className="btn-danger">Ləğv et</button>}
        </div>
      </form>
    </div>
  );
}
