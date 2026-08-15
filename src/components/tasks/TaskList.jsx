import TaskItem from './TaskItem';

export default function TaskList({ tasks = [], loading = false, error = null }) {
  if (loading) {
    return (
      <div className="card text-center py-12 text-slate-500">
        Yüklənir...
      </div>
    );
  }

  if (error) {
    return (
      <div className="card text-center py-12 text-red-500">
        Xəta: {error}
      </div>
    );
  }

  if (!tasks.length) {
    return (
      <div className="card text-center py-12">
        <p className="text-slate-500 text-lg">Tapşırıq tapılmadı</p>
        <p className="text-slate-400 text-sm mt-1">
          Filterləri sıfırla və ya yeni tapşırıq əlavə et
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}
