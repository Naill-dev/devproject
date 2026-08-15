import React from 'react';
import { useTasks } from '../../context/TaskContext';
import TaskItem from './TaskItem';

export default function TaskList() {
  const { tasks = [], loading, error } = useTasks();

  if (loading) return <div className="text-center py-10">Yüklənir...</div>;
  if (error) return <div className="text-red-500 text-center py-10">Xəta: {error}</div>;
  if (!tasks || tasks.length === 0) return <div className="text-center text-slate-500 py-10">Heç bir tapşırıq yoxdur</div>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}
