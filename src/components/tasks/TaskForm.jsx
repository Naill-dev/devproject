import { useState } from 'react';
import { useTasks } from '../../context/TaskContext';

export default function TaskForm({ onClose }) {
  const { addTask } = useTasks();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const setField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const err = {};
    if (!formData.title.trim()) err.title = 'Başlıq tələb olunur';
    if (!formData.category.trim()) err.category = 'Kateqoriya tələb olunur';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;
    setSaving(true);
    try {
      await addTask({
        title: formData.title.trim(),
        category: formData.category.trim(),
        status: formData.status,
        priority: formData.priority,
        dueDate: formData.dueDate
          ? new Date(formData.dueDate).toISOString()
          : null,
      });
      setFormData({
        title: '',
        category: '',
        status: 'pending',
        priority: 'medium',
        dueDate: '',
      });
      onClose?.();
    } catch (err) {
      setSubmitError(err.message || 'Tapşırıq əlavə edilərkən xəta baş verdi');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card p-5 border-indigo-400/20">
      <h2 className="text-lg font-semibold text-white mb-4">Yeni tapşırıq</h2>

      {submitError && (
        <p className="text-rose-300 text-sm mb-3 bg-rose-500/10 border border-rose-500/30 p-2.5 rounded-xl">
          {submitError}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Başlıq *</label>
            <input
              className="input-field"
              value={formData.title}
              onChange={(e) => setField('title', e.target.value)}
              placeholder="Tapşırıq adı"
            />
            {errors.title && (
              <p className="text-rose-400 text-sm mt-1">{errors.title}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Kateqoriya *</label>
            <input
              className="input-field"
              value={formData.category}
              onChange={(e) => setField('category', e.target.value)}
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
              onChange={(e) => setField('status', e.target.value)}
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
              onChange={(e) => setField('priority', e.target.value)}
            >
              <option value="low">Aşağı</option>
              <option value="medium">Orta</option>
              <option value="high">Yüksək</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-slate-300 mb-1">
              Deadline <span className="text-slate-500">(istəyə bağlı)</span>
            </label>
            <input
              type="datetime-local"
              className="input-field"
              value={formData.dueDate}
              onChange={(e) => setField('dueDate', e.target.value)}
            />
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
