import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { router } from './router';
import ErrorBoundary from './components/common/ErrorBoundary';
import Navbar from './components/common/Navbar';

function AppContent() {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <RouterProvider router={router} />
      </main>
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <TaskProvider>
          <AppContent />
        </TaskProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
