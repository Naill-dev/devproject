import { useState } from 'react';
import { useTasks } from '../../context/TaskContext';

export default function TaskForm({ onClose }) {
  const { addTask } = useTasks();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    status: 'pending',
    priority: 'medium',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

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
    setSaving(true);
    try {
      await addTask({
        title: formData.title.trim(),
        category: formData.category.trim(),
        status: formData.status,
        priority: formData.priority,
      });
      setFormData({ title: '', category: '', status: 'pending', priority: 'medium' });
      onClose?.();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card p-5 border-indigo-400/20">
      <h2 className="text-lg font-semibold text-white mb-4">Yeni tapşırıq</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Başlıq *</label>
            <input
              className="input-field"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Tapşırıq adı"
            />
            {errors.title && <p className="text-rose-400 text-sm mt-1">{errors.title}</p>}
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Kateqoriya *</label>
            <input
              className="input-field"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Dev, QA..."
            />
            {errors.category && (
              <p className="text-rose-400 text-sm mt-1">{errors.category}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Status</label>
            <select
              className="input-field"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="pending">Gözləyən</option>
              <option value="in-progress">Davam edən</option>
              <option value="completed">Tamamlanan</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Prioritet</label>
            <select
              className="input-field"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="low">Aşağı</option>
              <option value="medium">Orta</option>
              <option value="high">Yüksək</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Əlavə olunur...' : 'Əlavə et'}
          </button>
          {onClose && (
            <button type="button" onClick={onClose} className="btn-ghost">
              Ləğv et
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
