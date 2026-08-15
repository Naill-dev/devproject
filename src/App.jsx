import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { router } from './router';
import ErrorBoundary from './components/common/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <TaskProvider>
          <RouterProvider router={router} />
        </TaskProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
