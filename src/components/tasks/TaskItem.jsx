import { useState } from 'react';
import { useTasks } from '../../context/TaskContext';

export default function TaskItem({ task }) {
  const { updateTask, deleteTask } = useTasks();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);

  const handleUpdate = async () => {
    await updateTask(task.id, { title });
    setEditing(false);
  };

  const toggleStatus = () => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    updateTask(task.id, { status: newStatus });
  };

  return (
    <div className="card hover:scale-[1.02] transition-transform">
      {editing ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field flex-1"
          />
          <button onClick={handleUpdate} className="btn-primary">Yadda saxla</button>
          <button onClick={() => setEditing(false)} className="btn-danger">Ləğv</button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start">
            <h3 className={`text-lg font-semibold ${task.status === 'completed' ? 'line-through text-slate-400' : ''}`}>
              {task.title}
            </h3>
            <span className={`px-2 py-1 text-xs rounded-full ${
              task.priority === 'high' ? 'bg-red-100 text-red-700' :
              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-green-100 text-green-700'
            }`}>
              {task.priority}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">Kateqoriya: {task.category}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            <button onClick={toggleStatus} className="text-sm text-indigo-600 hover:underline">
              {task.status === 'completed' ? 'Aktiv et' : 'Tamamla'}
            </button>
            <button onClick={() => setEditing(true)} className="text-sm text-blue-600 hover:underline">
              Redaktə et
            </button>
            <button onClick={() => deleteTask(task.id)} className="text-sm text-red-600 hover:underline">
              Sil
            </button>
          </div>
        </>
      )}
    </div>
  );
}
