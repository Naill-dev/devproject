import { useState } from 'react';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';

export default function Tasks() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tapşırıqlar</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Bağla' : '+ Yeni tapşırıq'}
        </button>
      </div>
      {showForm && <TaskForm onClose={() => setShowForm(false)} />}
      <TaskList />
    </div>
  );
}
